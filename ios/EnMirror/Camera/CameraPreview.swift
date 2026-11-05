import AVFoundation
import SwiftUI

/// The live camera layer. Taps are read in UIKit so the preview layer can convert them to the
/// capture device's coordinates; that conversion accounts for the connection's mirroring, and
/// UIKit undoes the SwiftUI flip applied for "as others see you".
struct CameraPreview: UIViewRepresentable {
    let session: AVCaptureSession
    /// Single tap: the point in this view's coordinates and in the device's 0...1 space.
    var onTap: (_ viewPoint: CGPoint, _ devicePoint: CGPoint) -> Void = { _, _ in }
    var onDoubleTap: () -> Void = {}

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> PreviewView {
        let view = PreviewView()
        view.previewLayer.session = session
        view.previewLayer.videoGravity = .resizeAspectFill

        let coordinator = context.coordinator
        let doubleTap = UITapGestureRecognizer(target: coordinator, action: #selector(Coordinator.doubleTapped))
        doubleTap.numberOfTapsRequired = 2
        let tap = UITapGestureRecognizer(target: coordinator, action: #selector(Coordinator.tapped(_:)))
        tap.require(toFail: doubleTap)
        view.addGestureRecognizer(tap)
        view.addGestureRecognizer(doubleTap)
        return view
    }

    func updateUIView(_ uiView: PreviewView, context: Context) {
        context.coordinator.onTap = onTap
        context.coordinator.onDoubleTap = onDoubleTap
    }

    final class PreviewView: UIView {
        override class var layerClass: AnyClass { AVCaptureVideoPreviewLayer.self }

        var previewLayer: AVCaptureVideoPreviewLayer {
            // layerClass guarantees the type.
            layer as! AVCaptureVideoPreviewLayer  // swiftlint:disable:this force_cast
        }
    }

    @MainActor
    final class Coordinator: NSObject {
        var onTap: (CGPoint, CGPoint) -> Void = { _, _ in }
        var onDoubleTap: () -> Void = {}

        @objc func tapped(_ recognizer: UITapGestureRecognizer) {
            guard let view = recognizer.view as? PreviewView else { return }
            let point = recognizer.location(in: view)
            onTap(point, view.previewLayer.captureDevicePointConverted(fromLayerPoint: point))
        }

        @objc func doubleTapped() {
            onDoubleTap()
        }
    }
}
