import SwiftUI

/// The capture button, drawn like the Camera app's shutter: a white disc inside a white ring.
/// Captures a sharp still and freezes the mirror on it.
struct ShutterButton: View {
    let isBusy: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack {
                Circle()
                    .stroke(.white, lineWidth: 4)
                    .padding(2)
                if isBusy {
                    ProgressView().tint(.white)
                }
            }
            .frame(width: 74, height: 74)
            .contentShape(.circle)
        }
        .buttonStyle(Style(isBusy: isBusy))
        .disabled(isBusy)
        .accessibilityLabel(Text("Take photo"))
        .accessibilityHint(Text("Captures a still so you can look closely"))
    }

    /// The disc sits under the ring and shrinks while pressed, like the system shutter.
    private struct Style: ButtonStyle {
        let isBusy: Bool

        func makeBody(configuration: Configuration) -> some View {
            configuration.label
                .background {
                    Circle()
                        .fill(.white)
                        .padding(9)
                        .scaleEffect(configuration.isPressed ? 0.86 : 1)
                        .opacity(isBusy ? 0.35 : 1)
                        .animation(.snappy(duration: 0.15), value: configuration.isPressed)
                }
        }
    }
}
