import SwiftUI

/// The live side of the mirror: the camera preview (or, with a delay, the frames from a few
/// seconds ago), tap to meter, pinch to zoom, and the permission and no-camera states.
struct LivePreview: View {
    let camera: CameraService
    /// Flips the mirrored image back to the true view.
    let asOthersSee: Bool

    @Environment(\.openURL) private var openURL
    @State private var pinchBase: CGFloat?
    @State private var focusMark: FocusMark?

    /// Where the last tap landed, in the preview's own (unflipped) coordinates.
    private struct FocusMark: Equatable {
        let id = UUID()
        let point: CGPoint
    }

    var body: some View {
        ZStack {
            Color.black
            switch camera.status {
            case .starting, .running:
                mirror
                    // The front-camera image is mirrored by default; flip it back for the true view.
                    .scaleEffect(x: asOthersSee ? -1 : 1, y: 1)
                    .gesture(pinchToZoom)
                    .accessibilityLabel(Text("Mirror"))
                // Outside the flip, so the text reads the right way round.
                if let delay = camera.delay, camera.isDelayFilling {
                    Text("Turn around. You'll see yourself here in \(Int(delay)) s.")
                        .font(.headline)
                        .multilineTextAlignment(.center)
                        .foregroundStyle(.white)
                        .padding(32)
                }
            case .denied:
                ContentUnavailableView {
                    Label("Camera access is off", systemImage: "camera.fill")
                } description: {
                    Text("Allow camera access for enMirror in Settings to use the mirror.")
                } actions: {
                    Button("Open Settings") {
                        if let url = URL(string: UIApplication.openSettingsURLString) { openURL(url) }
                    }
                    .buttonStyle(.glassProminent)
                }
            case .unavailable:
                ContentUnavailableView(
                    "No front camera",
                    systemImage: "video.slash",
                    description: Text("enMirror needs a device with a front camera.")
                )
            }
        }
        .animation(.easeOut(duration: 0.3), value: focusMark)
    }

    @ViewBuilder
    private var mirror: some View {
        #if DEBUG
            if let demo = StoreDemo.image {
                // Store screenshots on the simulator: the demo photo stands in for the camera.
                Color.clear
                    .overlay { Image(uiImage: demo).resizable().scaledToFill().scaleEffect(camera.zoom) }
                    .clipped()
            } else {
                cameraMirror
            }
        #else
            cameraMirror
        #endif
    }

    @ViewBuilder
    private var cameraMirror: some View {
        if camera.delay != nil {
            DelayedPreview(layer: camera.delayLayer)
        } else {
            CameraPreview(
                session: camera.session,
                onTap: { viewPoint, devicePoint in
                    camera.meter(at: devicePoint)
                    focusMark = FocusMark(point: viewPoint)
                },
                onDoubleTap: { camera.setZoom(camera.zoomRange.lowerBound) }
            )
            // Inside the flip, so the square lands where the finger did.
            .overlay(alignment: .topLeading) { focusSquare }
        }
    }

    @ViewBuilder
    private var focusSquare: some View {
        if let focusMark {
            FocusSquare()
                .id(focusMark.id)
                .position(focusMark.point)
                .task(id: focusMark.id) {
                    try? await Task.sleep(for: .seconds(1.2))
                    if self.focusMark == focusMark { self.focusMark = nil }
                }
        }
    }

    private var pinchToZoom: some Gesture {
        MagnifyGesture()
            .onChanged { value in
                let base = pinchBase ?? camera.zoom
                pinchBase = base
                camera.setZoom(
                    CameraMath.pinchedZoom(base: base, magnification: value.magnification, range: camera.zoomRange)
                )
            }
            .onEnded { _ in pinchBase = nil }
    }
}
