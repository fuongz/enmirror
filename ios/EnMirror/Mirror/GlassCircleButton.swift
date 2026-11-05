import SwiftUI

/// Round Liquid Glass button used in the bottom bar and for the About button.
struct GlassCircleButton<Content: View>: View {
    let label: LocalizedStringKey
    var isActive = false
    var diameter: CGFloat = 54
    let action: () -> Void
    @ViewBuilder let content: () -> Content

    var body: some View {
        Button(action: action) {
            content()
                .font(.system(size: 20, weight: .semibold))
                .foregroundStyle(isActive ? Color.black : Color.white)
                .frame(width: diameter, height: diameter)
                .contentShape(.circle)
        }
        .buttonStyle(.plain)
        .glassEffect(.regular.tint(isActive ? Color.accentColor : nil).interactive(), in: .circle)
        .accessibilityLabel(Text(label))
        .accessibilityAddTraits(isActive ? .isSelected : [])
    }
}
