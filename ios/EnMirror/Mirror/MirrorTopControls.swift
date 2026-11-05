import SwiftUI

/// The delayed mirror and the alignment guide, in the top-right corner. Tap steps to the next
/// choice; touch and hold opens a menu to pick one directly.
struct MirrorTopControls: View {
    let camera: CameraService
    @Binding var guide: Guide
    /// Reports the new choice by name, for the toast.
    let onChange: (LocalizedStringResource) -> Void

    var body: some View {
        HStack(spacing: 12) {
            delayButton
            guideButton
        }
    }

    private var delayButton: some View {
        GlassCircleMenuButton(
            label: "Delayed mirror",
            isActive: camera.delay != nil,
            diameter: 44,
            action: { setDelay(MirrorDelay.next(after: camera.delay)) }
        ) {
            Picker("Delayed mirror", selection: Binding(get: { camera.delay }, set: setDelay)) {
                Text(MirrorDelay.name(nil)).tag(Double?.none)
                ForEach(MirrorDelay.choices, id: \.self) { seconds in
                    Text(MirrorDelay.name(seconds)).tag(Double?.some(seconds))
                }
            }
        } content: {
            if let delay = camera.delay {
                Text(verbatim: "\(Int(delay))s")
                    .font(.system(size: 15, weight: .bold).monospacedDigit())
            } else {
                Image(systemName: "clock.arrow.circlepath")
            }
        }
        .accessibilityValue(Text(MirrorDelay.name(camera.delay)))
        .disabled(camera.status != .running)
    }

    private var guideButton: some View {
        GlassCircleMenuButton(
            label: "Alignment guide",
            isActive: guide != .off,
            diameter: 44,
            action: { setGuide(guide.next) }
        ) {
            Picker("Alignment guide", selection: Binding(get: { guide }, set: setGuide)) {
                ForEach(Guide.allCases, id: \.self) { choice in
                    Text(choice.name).tag(choice)
                }
            }
        } content: {
            Image(systemName: "squareshape.split.2x2.dotted")
        }
        .accessibilityValue(Text(guide.name))
    }

    private func setDelay(_ delay: Double?) {
        camera.setDelay(delay)
        onChange(MirrorDelay.name(delay))
    }

    private func setGuide(_ choice: Guide) {
        guide = choice
        onChange(choice.name)
    }
}
