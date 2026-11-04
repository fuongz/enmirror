import SwiftUI

/// Round Liquid Glass button used in the bottom bar.
struct GlassCircleButton<Content: View>: View {
    let label: LocalizedStringKey
    var isActive = false
    let action: () -> Void
    @ViewBuilder let content: () -> Content

    var body: some View {
        Button(action: action) {
            content()
                .font(.system(size: 20, weight: .semibold))
                .foregroundStyle(isActive ? Color.black : Color.white)
                .frame(width: 54, height: 54)
                .contentShape(.circle)
        }
        .buttonStyle(.plain)
        .glassEffect(.regular.tint(isActive ? Color.accentColor : nil).interactive(), in: .circle)
        .accessibilityLabel(Text(label))
        .accessibilityAddTraits(isActive ? .isSelected : [])
    }
}
