import AVFoundation
import SwiftUI

/// Hosts the delayed mirror's display layer, which `DelayPipeline` fills from its own queue.
struct DelayedPreview: UIViewRepresentable {
    let layer: AVSampleBufferDisplayLayer

    func makeUIView(context: Context) -> HostView {
        let view = HostView()
        view.backgroundColor = .black
        view.hosted = layer
        view.layer.addSublayer(layer)
        return view
    }

    func updateUIView(_ uiView: HostView, context: Context) {}

    static func dismantleUIView(_ uiView: HostView, coordinator: ()) {
        uiView.hosted?.removeFromSuperlayer()
    }

    final class HostView: UIView {
        var hosted: CALayer?

        override func layoutSubviews() {
            super.layoutSubviews()
            CATransaction.begin()
            CATransaction.setDisableActions(true)
            hosted?.frame = bounds
            CATransaction.commit()
        }
    }
}
