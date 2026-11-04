import AVFoundation

/// Owns the AVCaptureSession. Every session/device call runs on `queue`, so the
/// type is safe to share across actors even though AVFoundation objects are not Sendable.
final class CaptureEngine: @unchecked Sendable {
    struct Capabilities: Sendable {
        let zoomRange: ClosedRange<CGFloat>
        let biasRange: ClosedRange<Float>
    }

    enum CaptureError: Error {
        case notConfigured
        case noData
    }

    let session = AVCaptureSession()

    private let queue = DispatchQueue(label: "com.trinhvaphuong.enmirror.capture", qos: .userInitiated)
    private let photoOutput = AVCapturePhotoOutput()
    private var device: AVCaptureDevice?
    private var capabilities: Capabilities?
    private var inFlight: [Int64: PhotoDelegate] = [:]
    private var subjectAreaObserver: (any NSObjectProtocol)?

    deinit {
        if let subjectAreaObserver { NotificationCenter.default.removeObserver(subjectAreaObserver) }
    }

    func configure() async -> Capabilities? {
        await withCheckedContinuation { continuation in
            queue.async { continuation.resume(returning: self.configureOnQueue()) }
        }
    }

    func start() async {
        await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
            queue.async {
                if self.device != nil, !self.session.isRunning { self.session.startRunning() }
                continuation.resume()
            }
        }
    }

    func stop() {
        queue.async {
            if self.session.isRunning { self.session.stopRunning() }
        }
    }

    func setZoom(_ factor: CGFloat) {
        queue.async {
            guard let device = self.device, let range = self.capabilities?.zoomRange else { return }
            self.withLockedDevice(device) { $0.videoZoomFactor = CameraMath.clamp(factor, to: range) }
        }
    }

    func setExposureBias(_ bias: Float) {
        queue.async {
            guard let device = self.device, let range = self.capabilities?.biasRange else { return }
            self.withLockedDevice(device) {
                $0.setExposureTargetBias(CameraMath.clamp(bias, to: range), completionHandler: nil)
            }
        }
    }

    /// Focuses (where the camera can) and meters exposure on `devicePoint`, in the capture
    /// device's 0...1 space. The iPhone 13 Pro's front camera has fixed focus and only re-meters;
    /// front autofocus arrived with iPhone 14. Both go back to automatic when the scene changes.
    func meter(at devicePoint: CGPoint) {
        queue.async {
            guard let device = self.device else { return }
            self.withLockedDevice(device) { device in
                Self.point(device, at: devicePoint, focusMode: .autoFocus)
                device.isSubjectAreaChangeMonitoringEnabled = true
            }
        }
    }

    /// Full-resolution still. `mirrored` should match what the preview shows.
    func capturePhoto(mirrored: Bool) async throws -> Data {
        try await withCheckedThrowingContinuation { continuation in
            queue.async {
                guard self.device != nil, let connection = self.photoOutput.connection(with: .video) else {
                    continuation.resume(throwing: CaptureError.notConfigured)
                    return
                }
                if connection.isVideoMirroringSupported {
                    connection.automaticallyAdjustsVideoMirroring = false
                    connection.isVideoMirrored = mirrored
                }
                if connection.isVideoRotationAngleSupported(90) {
                    connection.videoRotationAngle = 90  // the app is portrait-only
                }

                let settings: AVCapturePhotoSettings
                if self.photoOutput.availablePhotoCodecTypes.contains(.hevc) {
                    settings = AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.hevc])
                } else {
                    settings = AVCapturePhotoSettings()
                }
                settings.maxPhotoDimensions = self.photoOutput.maxPhotoDimensions
                settings.photoQualityPrioritization = .quality

                let id = settings.uniqueID
                // The delegate retains self only until this entry is removed.
                let delegate = PhotoDelegate { result in
                    self.queue.async { self.inFlight[id] = nil }
                    continuation.resume(with: result)
                }
                self.inFlight[id] = delegate
                self.photoOutput.capturePhoto(with: settings, delegate: delegate)
            }
        }
    }

    // MARK: - Queue-only

    private func configureOnQueue() -> Capabilities? {
        if let capabilities { return capabilities }

        guard
            let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
            let input = try? AVCaptureDeviceInput(device: device)
        else { return nil }

        session.beginConfiguration()
        session.sessionPreset = .photo
        guard session.canAddInput(input), session.canAddOutput(photoOutput) else {
            session.commitConfiguration()
            return nil
        }
        session.addInput(input)
        session.addOutput(photoOutput)
        useSharpestFormat(of: device)

        let largest = device.activeFormat.supportedMaxPhotoDimensions.max {
            Int($0.width) * Int($0.height) < Int($1.width) * Int($1.height)
        }
        if let largest { photoOutput.maxPhotoDimensions = largest }
        photoOutput.maxPhotoQualityPrioritization = .quality
        session.commitConfiguration()

        withLockedDevice(device) { device in
            Self.point(device, at: Self.center, focusMode: .continuousAutoFocus)
            if device.isWhiteBalanceModeSupported(.continuousAutoWhiteBalance) {
                device.whiteBalanceMode = .continuousAutoWhiteBalance
            }
        }
        subjectAreaObserver = NotificationCenter.default.addObserver(
            forName: AVCaptureDevice.subjectAreaDidChangeNotification, object: device, queue: nil
        ) { [weak self] _ in
            guard let self else { return }
            self.queue.async { self.resumeAutomaticMetering() }
        }

        let capabilities = Capabilities(
            zoomRange: CameraMath.zoomRange(
                deviceMin: device.minAvailableVideoZoomFactor,
                deviceMax: device.maxAvailableVideoZoomFactor
            ),
            biasRange: CameraMath.biasRange(
                deviceMin: device.minExposureTargetBias,
                deviceMax: device.maxExposureTargetBias
            )
        )
        self.device = device
        self.capabilities = capabilities
        return capabilities
    }

    private static let center = CGPoint(x: 0.5, y: 0.5)

    /// After a tap the point holds until the subject moves; then the whole frame drives it again.
    private func resumeAutomaticMetering() {
        guard let device else { return }
        withLockedDevice(device) { device in
            Self.point(device, at: Self.center, focusMode: .continuousAutoFocus)
            device.isSubjectAreaChangeMonitoringEnabled = false
        }
    }

    /// Setting a point of interest takes effect when the mode is set after it.
    private static func point(_ device: AVCaptureDevice, at point: CGPoint, focusMode: AVCaptureDevice.FocusMode) {
        if device.isFocusPointOfInterestSupported, device.isFocusModeSupported(focusMode) {
            device.focusPointOfInterest = point
            device.focusMode = focusMode
        }
        if device.isExposurePointOfInterestSupported, device.isExposureModeSupported(.continuousAutoExposure) {
            device.exposurePointOfInterest = point
            device.exposureMode = .continuousAutoExposure
        }
    }

    /// Replaces the preset's 1080p stream with the sharpest format that keeps 30 fps. Setting
    /// `activeFormat` switches the session to `.inputPriority`, so the preset no longer overrides it.
    private func useSharpestFormat(of device: AVCaptureDevice) {
        let candidates = device.formats.map { format in
            let dimensions = format.formatDescription.dimensions
            return CameraMath.FormatCandidate(
                width: dimensions.width,
                height: dimensions.height,
                maxFrameRate: format.videoSupportedFrameRateRanges.map(\.maxFrameRate).max() ?? 0
            )
        }
        guard let index = CameraMath.bestFormatIndex(candidates) else { return }
        withLockedDevice(device) { $0.activeFormat = device.formats[index] }
    }

    private func withLockedDevice(_ device: AVCaptureDevice, _ body: (AVCaptureDevice) -> Void) {
        do {
            try device.lockForConfiguration()
            body(device)
            device.unlockForConfiguration()
        } catch {
            // Another client holds the device; the next change will retry.
        }
    }
}

private final class PhotoDelegate: NSObject, AVCapturePhotoCaptureDelegate, @unchecked Sendable {
    private let completion: @Sendable (Result<Data, Error>) -> Void

    init(completion: @escaping @Sendable (Result<Data, Error>) -> Void) {
        self.completion = completion
    }

    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error {
            completion(.failure(error))
        } else if let data = photo.fileDataRepresentation() {
            completion(.success(data))
        } else {
            completion(.failure(CaptureEngine.CaptureError.noData))
        }
    }
}
