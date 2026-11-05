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
    /// Seconds the mirror runs behind, or nil for the live mirror.
    private(set) var delay: Double?
    /// Counts the times a delayed mirror started showing old frames (drives a haptic).
    private(set) var delayStarts = 0
    /// True from turning the delay on until its first old frame shows.
    private(set) var isDelayFilling = false
    @ObservationIgnored private var delayGeneration = 0

    @ObservationIgnored private let engine = CaptureEngine()

    var session: AVCaptureSession { engine.session }
    var delayLayer: AVSampleBufferDisplayLayer { engine.delay.layer }
    var canZoom: Bool { zoomRange.upperBound > zoomRange.lowerBound }
    var canAdjustExposure: Bool { biasRange.upperBound > biasRange.lowerBound }

    func start() async {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            break
        case .notDetermined:
            guard await AVCaptureDevice.requestAccess(for: .video) else {
                fail(.denied)
                return
            }
        default:
            fail(.denied)
            return
        }

        guard let capabilities = await engine.configure() else {
            fail(.unavailable)
            return
        }
        zoomRange = capabilities.zoomRange
        biasRange = capabilities.biasRange
        let saved = UserDefaults.standard.object(forKey: SettingsKey.zoom) as? Double
        setZoom(CameraMath.restoredZoom(saved: saved, range: zoomRange))
        await engine.start()
        status = .running
    }

    func stop() {
        setDelay(nil)
        engine.stop()
    }

    /// No camera to delay: a widget or quick action may have asked for the delayed mirror.
    private func fail(_ status: Status) {
        self.status = status
        setDelay(nil)
    }

    func setDelay(_ seconds: Double?) {
        guard seconds != delay else { return }
        delay = seconds
        isDelayFilling = seconds != nil
        // A first frame from an earlier delay must not end this one's wait.
        delayGeneration += 1
        let generation = delayGeneration
        engine.setDelay(seconds) { [weak self] in
            Task { @MainActor in
                guard let self, self.isDelayFilling, self.delayGeneration == generation else { return }
                self.isDelayFilling = false
                self.delayStarts += 1
            }
        }
    }

    func setZoom(_ value: CGFloat) {
        let clamped = CameraMath.clamp(value, to: zoomRange)
        guard clamped != zoom else { return }
        zoom = clamped
        engine.setZoom(clamped)
        UserDefaults.standard.set(Double(clamped), forKey: SettingsKey.zoom)
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

    /// The live camera's full-resolution still, or with a delay the old frame on screen.
    func capturePhoto(mirrored: Bool) async throws -> Data {
        guard delay != nil else { return try await engine.capturePhoto(mirrored: mirrored) }
        guard let data = await engine.delay.photoData(mirrored: mirrored) else { throw CaptureEngine.CaptureError.noData }
        return data
    }
}
