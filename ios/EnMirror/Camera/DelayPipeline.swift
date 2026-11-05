import AVFoundation
import CoreImage
import VideoToolbox

/// Receives the camera's preview-sized frames, shrinks them, holds them for the chosen delay and
/// shows them on `layer`. Everything runs on `queue`, which is also the video output's delegate
/// queue, so the type is safe to share even though the buffers and the layer are not Sendable.
final class DelayPipeline: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate, @unchecked Sendable {
    let layer: AVSampleBufferDisplayLayer
    let queue = DispatchQueue(label: "com.trinhvaphuong.enmirror.delay", qos: .userInitiated)

    private var buffer = DelayBuffer<CVPixelBuffer>(delay: 0)
    private var transfer: VTPixelTransferSession?
    private var pool: CVPixelBufferPool?
    private var poolSize: CGSize = .zero
    private var shown: CVPixelBuffer?
    private var onFirstFrame: (@Sendable () -> Void)?
    private lazy var context = CIContext()
    /// The layer itself is main-actor bound; its renderer takes frames from any thread.
    private let renderer: AVSampleBufferVideoRenderer

    @MainActor
    override init() {
        layer = AVSampleBufferDisplayLayer()
        layer.videoGravity = .resizeAspectFill
        renderer = layer.sampleBufferRenderer
        super.init()
    }

    /// Starts holding frames for `delay` seconds; `onFirstFrame` runs once, when the first old
    /// frame appears.
    func start(delay: Double, onFirstFrame: @escaping @Sendable () -> Void) {
        // On the queue, after any frame still in flight, so no frame of the last delay survives.
        queue.async {
            self.buffer = DelayBuffer(delay: delay)
            self.shown = nil
            self.onFirstFrame = onFirstFrame
            self.renderer.flush(removingDisplayedImage: true, completionHandler: nil)
        }
    }

    /// Drops every held frame and the pool behind them.
    func stop() {
        queue.async {
            self.buffer.removeAll()
            self.shown = nil
            self.pool = nil
            self.poolSize = .zero
            if let transfer = self.transfer { VTPixelTransferSessionInvalidate(transfer) }
            self.transfer = nil
            self.onFirstFrame = nil
            self.renderer.flush(removingDisplayedImage: true, completionHandler: nil)
        }
    }

    /// The frame on screen as a JPEG. It is held mirrored, like the preview; `mirrored: false`
    /// flips it back for "as others see you".
    func photoData(mirrored: Bool) async -> Data? {
        await withCheckedContinuation { continuation in
            queue.async {
                guard let shown = self.shown else { return continuation.resume(returning: nil) }
                var image = CIImage(cvPixelBuffer: shown)
                if !mirrored { image = image.oriented(.upMirrored) }
                let data = self.context.jpegRepresentation(
                    of: image,
                    colorSpace: CGColorSpace(name: CGColorSpace.sRGB) ?? CGColorSpaceCreateDeviceRGB(),
                    options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.9]
                )
                continuation.resume(returning: data)
            }
        }
    }

    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard buffer.delay > 0, let source = sampleBuffer.imageBuffer, let small = shrink(source) else { return }
        guard let due = buffer.push(small, at: sampleBuffer.presentationTimeStamp.seconds) else { return }
        show(due)
    }

    // MARK: - Queue-only

    private func show(_ frame: CVPixelBuffer) {
        if shown == nil, let onFirstFrame {
            DispatchQueue.main.async { onFirstFrame() }
        }
        shown = frame
        // Both only fail for a malformed buffer; skipping that one frame keeps the mirror running.
        guard
            let format = try? CMVideoFormatDescription(imageBuffer: frame),
            let sample = try? CMSampleBuffer(
                imageBuffer: frame,
                formatDescription: format,
                sampleTiming: CMSampleTimingInfo(duration: .invalid, presentationTimeStamp: .zero, decodeTimeStamp: .invalid)
            )
        else { return }
        sample.sampleAttachments[0][.displayImmediately] = true
        if renderer.status == .failed { renderer.flush() }
        renderer.enqueue(sample)
    }

    /// Scales a frame so its long side is `MirrorDelay.frameLongSide`, into a reused pool.
    private func shrink(_ source: CVPixelBuffer) -> CVPixelBuffer? {
        let width = CVPixelBufferGetWidth(source)
        let height = CVPixelBufferGetHeight(source)
        let target = CameraMath.scaledSize(width: width, height: height, longSide: MirrorDelay.frameLongSide)
        if pool == nil || poolSize != target {
            pool = Self.makePool(size: target, format: CVPixelBufferGetPixelFormatType(source))
            poolSize = target
        }
        if transfer == nil {
            var session: VTPixelTransferSession?
            VTPixelTransferSessionCreate(allocator: nil, pixelTransferSessionOut: &session)
            transfer = session
        }
        guard let pool, let transfer else { return nil }
        var output: CVPixelBuffer?
        CVPixelBufferPoolCreatePixelBuffer(nil, pool, &output)
        guard let output, VTPixelTransferSessionTransferImage(transfer, from: source, to: output) == noErr else {
            return nil
        }
        return output
    }

    private static func makePool(size: CGSize, format: OSType) -> CVPixelBufferPool? {
        let attributes: [CFString: Any] = [
            kCVPixelBufferPixelFormatTypeKey: format,
            kCVPixelBufferWidthKey: Int(size.width),
            kCVPixelBufferHeightKey: Int(size.height),
            kCVPixelBufferIOSurfacePropertiesKey: [CFString: Any](),
        ]
        var pool: CVPixelBufferPool?
        CVPixelBufferPoolCreate(nil, nil, attributes as CFDictionary, &pool)
        return pool
    }
}
