import CoreGraphics

/// Pure math behind the mirror controls, kept free of UIKit/AVFoundation so it is unit-testable.
enum CameraMath {
    /// Front cameras zoom digitally; past 3× even the full-resolution stream is mostly blur.
    static let maxUsefulZoom: CGFloat = 3
    /// The live mirror must stay smooth; a sharper format that can't reach this is not worth it.
    static let minimumPreviewFrameRate = 30.0

    /// What matters about a camera format when choosing the live stream.
    struct FormatCandidate: Equatable {
        let width: Int32
        let height: Int32
        let maxFrameRate: Double

        var pixelCount: Int { Int(width) * Int(height) }
    }
    /// Exposure bias range we expose, in EV. Devices usually allow ±8, which is unusable.
    static let biasLimit: Float = 2

    static func clamp<T: Comparable>(_ value: T, to range: ClosedRange<T>) -> T {
        min(max(value, range.lowerBound), range.upperBound)
    }

    static func zoomRange(deviceMin: CGFloat, deviceMax: CGFloat) -> ClosedRange<CGFloat> {
        let lower = max(deviceMin, 1)
        let upper = max(lower, min(deviceMax, maxUsefulZoom))
        return lower...upper
    }

    static func pinchedZoom(base: CGFloat, magnification: CGFloat, range: ClosedRange<CGFloat>) -> CGFloat {
        clamp(base * magnification, to: range)
    }

    static func biasRange(deviceMin: Float, deviceMax: Float) -> ClosedRange<Float> {
        let lower = max(deviceMin, -biasLimit)
        let upper = min(deviceMax, biasLimit)
        return lower <= upper ? lower...upper : 0...0
    }

    /// The format with the most pixels that still runs at 30 fps, so zooming crops from real detail
    /// instead of upscaling the 1080p default. Ties go to the higher frame rate, then the first.
    static func bestFormatIndex(_ candidates: [FormatCandidate]) -> Int? {
        var best: Int?
        for (index, candidate) in candidates.enumerated() where candidate.maxFrameRate >= minimumPreviewFrameRate {
            guard let current = best else {
                best = index
                continue
            }
            let leader = candidates[current]
            if candidate.pixelCount > leader.pixelCount
                || (candidate.pixelCount == leader.pixelCount && candidate.maxFrameRate > leader.maxFrameRate)
            {
                best = index
            }
        }
        return best
    }

    /// The zoom to start with: the last one used, clamped to this camera's range; 1× if none.
    static func restoredZoom(saved: Double?, range: ClosedRange<CGFloat>) -> CGFloat {
        clamp(CGFloat(saved ?? 1), to: range)
    }

    /// `width`×`height` scaled so its long side is `longSide`, never enlarged, with even sides
    /// (4:2:0 frames need them).
    static func scaledSize(width: Int, height: Int, longSide: Int) -> CGSize {
        let long = max(width, height)
        guard long > 0 else { return .zero }
        let scale = min(1, Double(longSide) / Double(long))
        func even(_ value: Int) -> Int { max(2, Int((Double(value) * scale / 2).rounded()) * 2) }
        return CGSize(width: even(width), height: even(height))
    }
}
