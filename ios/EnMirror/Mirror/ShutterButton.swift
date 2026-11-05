import SwiftUI

/// The capture button, drawn like the Camera app's shutter: a white disc inside a white ring.
/// Tap captures a sharp still and freezes the mirror on it; touch and hold picks the self-timer.
struct ShutterButton: View {
    let isBusy: Bool
    var timer: Int?
    var isCounting = false
    var onTimerChange: (Int?) -> Void = { _ in }
    let action: () -> Void

    var body: some View {
        Menu {
            Picker(
                "Self-timer",
                selection: Binding(get: { timer }, set: { onTimerChange($0) })
            ) {
                Text("Timer off").tag(Int?.none)
                ForEach(SelfTimer.choices, id: \.self) { seconds in
                    Text("\(seconds)-second timer").tag(Int?.some(seconds))
                }
            }
        } label: {
            ZStack {
                Circle()
                    .stroke(.white, lineWidth: 4)
                    .padding(2)
                if isBusy {
                    ProgressView().tint(.white)
                } else if isCounting {
                    Image(systemName: "xmark")
                        .font(.system(size: 22, weight: .bold))
                        .foregroundStyle(.black)
                }
            }
            .frame(width: 74, height: 74)
            .contentShape(.circle)
            .overlay(alignment: .topTrailing) { badge }
        } primaryAction: {
            action()
        }
        .menuStyle(.button)
        .buttonStyle(Style(isBusy: isBusy))
        .disabled(isBusy)
        .accessibilityLabel(Text(isCounting ? "Cancel timer" : "Take photo"))
        .accessibilityValue(timer.map { Text("\($0)-second timer") } ?? Text(""))
        .accessibilityHint(Text("Captures a still so you can look closely. Touch and hold to set a timer."))
    }

    /// The chosen timer, like the Camera app's: a small capsule on the ring.
    @ViewBuilder
    private var badge: some View {
        if let timer {
            Text(verbatim: "\(timer)s")
                .font(.system(size: 11, weight: .bold).monospacedDigit())
                .foregroundStyle(.black)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(Color.accentColor, in: .capsule)
                .offset(x: 6, y: -4)
        }
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
