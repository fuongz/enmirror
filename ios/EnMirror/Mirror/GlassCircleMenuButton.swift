import SwiftUI

/// A `GlassCircleButton` that also opens a menu: tap runs `action`, touch and hold shows `menu`
/// for picking a value directly.
struct GlassCircleMenuButton<Content: View, MenuItems: View>: View {
    let label: LocalizedStringKey
    var isActive = false
    var diameter: CGFloat = 54
    let action: () -> Void
    @ViewBuilder let menu: () -> MenuItems
    @ViewBuilder let content: () -> Content

    var body: some View {
        Menu {
            menu()
        } label: {
            content()
                .font(.system(size: 20, weight: .semibold))
                .foregroundStyle(isActive ? Color.black : Color.white)
                .frame(width: diameter, height: diameter)
                .contentShape(.circle)
        } primaryAction: {
            action()
        }
        .menuStyle(.button)
        .buttonStyle(.plain)
        .glassEffect(.regular.tint(isActive ? Color.accentColor : nil).interactive(), in: .circle)
        .accessibilityLabel(Text(label))
        .accessibilityAddTraits(isActive ? .isSelected : [])
    }
}
