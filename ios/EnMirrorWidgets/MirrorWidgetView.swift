import AppIntents
import SwiftUI
import WidgetKit

/// The widget's face for each family; every tap runs an intent that opens the mirror.
struct MirrorWidgetView: View {
    @Environment(\.widgetFamily) private var family

    /// The app icon's purple gradient (AppIcon.icon).
    private static let top = Color(.displayP3, red: 0.50977, green: 0.28638, blue: 0.96484)
    private static let bottom = Color(.displayP3, red: 0.19214, green: 0.07062, blue: 0.52148)

    var body: some View {
        switch family {
        case .accessoryCircular:
            Button(intent: OpenMirrorIntent()) {
                ZStack {
                    AccessoryWidgetBackground()
                    Image(systemName: "person.crop.square")
                        .font(.system(size: 22, weight: .semibold))
                }
            }
            .buttonStyle(.plain)
            .containerBackground(.clear, for: .widget)
            .accessibilityLabel(Text("Open Mirror"))
        case .accessoryRectangular:
            Button(intent: OpenMirrorIntent()) {
                HStack(spacing: 8) {
                    Image(systemName: "person.crop.square")
                        .font(.system(size: 26, weight: .semibold))
                    VStack(alignment: .leading, spacing: 0) {
                        Text(verbatim: "enMirror").font(.headline).widgetAccentable()
                        Text("Check yourself").font(.caption)
                    }
                    Spacer(minLength: 0)
                }
            }
            .buttonStyle(.plain)
            .containerBackground(.clear, for: .widget)
        case .systemMedium:
            HStack(spacing: 14) {
                mirrorArt(size: 96)
                VStack(spacing: 10) {
                    action("Mirror", systemImage: "person.crop.square", intent: OpenMirrorIntent())
                    action("Mirror + Light", systemImage: "lightbulb.max", intent: OpenMirrorWithLightIntent())
                }
            }
            .containerBackground(for: .widget) { gradient }
        default:
            Button(intent: OpenMirrorIntent()) {
                VStack(spacing: 6) {
                    mirrorArt(size: 92)
                    Text("Mirror")
                        .font(.headline)
                        .foregroundStyle(.white)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .buttonStyle(.plain)
            .containerBackground(for: .widget) { gradient }
            .accessibilityLabel(Text("Open Mirror"))
        }
    }

    private var gradient: some View {
        LinearGradient(colors: [Self.top, Self.bottom], startPoint: .top, endPoint: .bottom)
    }

    private func mirrorArt(size: CGFloat) -> some View {
        Image(.handMirror)
            .resizable()
            .scaledToFit()
            .frame(width: size, height: size)
            .shadow(color: .black.opacity(0.3), radius: 6, y: 3)
            .accessibilityHidden(true)
    }

    private func action(_ title: LocalizedStringResource, systemImage: String, intent: some AppIntent) -> some View {
        Button(intent: intent) {
            Label(title, systemImage: systemImage)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 12)
                .padding(.vertical, 10)
                .background(.white.opacity(0.18), in: .capsule)
        }
        .buttonStyle(.plain)
    }
}

#Preview("Small", as: .systemSmall) {
    MirrorWidget()
} timeline: {
    MirrorWidget.Entry(date: .now)
}

#Preview("Medium", as: .systemMedium) {
    MirrorWidget()
} timeline: {
    MirrorWidget.Entry(date: .now)
}

#Preview("Lock Screen", as: .accessoryRectangular) {
    MirrorWidget()
} timeline: {
    MirrorWidget.Entry(date: .now)
}
