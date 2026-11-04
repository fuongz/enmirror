import AVFoundation
import Observation

/// Main-actor face of the camera that SwiftUI observes.
@MainActor
@Observable
final class CameraService {
    enum Status {
        case starting
        case running
        case denied
        case unavailable
    }

    private(set) var status: Status = .starting
    private(set) var zoom: CGFloat = 1
    private(set) var zoomRange: ClosedRange<CGFloat> = 1...1
    private(set) var exposureBias: Float = 0
    private(set) var biasRange: ClosedRange<Float> = 0...0

    @ObservationIgnored private let engine = CaptureEngine()

    var session: AVCaptureSession { engine.session }
    var canZoom: Bool { zoomRange.upperBound > zoomRange.lowerBound }
    var canAdjustExposure: Bool { biasRange.upperBound > biasRange.lowerBound }

    func start() async {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            break
        case .notDetermined:
            guard await AVCaptureDevice.requestAccess(for: .video) else {
                status = .denied
                return
            }
        default:
            status = .denied
            return
        }

        guard let capabilities = await engine.configure() else {
            status = .unavailable
            return
        }
        zoomRange = capabilities.zoomRange
        biasRange = capabilities.biasRange
        await engine.start()
        status = .running
    }

    func stop() {
        engine.stop()
    }

    func setZoom(_ value: CGFloat) {
        let clamped = CameraMath.clamp(value, to: zoomRange)
        guard clamped != zoom else { return }
        zoom = clamped
        engine.setZoom(clamped)
    }

    func setExposureBias(_ value: Float) {
        let clamped = CameraMath.clamp(value, to: biasRange)
        guard clamped != exposureBias else { return }
        exposureBias = clamped
        engine.setExposureBias(clamped)
    }

    /// `devicePoint` is in the capture device's 0...1 space (`CameraPreview` converts taps).
    func meter(at devicePoint: CGPoint) {
        engine.meter(at: devicePoint)
    }

    func capturePhoto(mirrored: Bool) async throws -> Data {
        try await engine.capturePhoto(mirrored: mirrored)
    }
}
