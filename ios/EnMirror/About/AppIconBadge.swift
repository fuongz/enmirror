import SwiftUI

/// The app icon drawn in SwiftUI for the About header. iOS gives apps no API to load their own
/// icon, so this repeats AppIcon.icon: its purple gradient and the hand-mirror layer.
struct AppIconBadge: View {
    var size: CGFloat = 88

    private static let top = Color(.displayP3, red: 0.50977, green: 0.28638, blue: 0.96484)
    private static let bottom = Color(.displayP3, red: 0.19214, green: 0.07062, blue: 0.52148)

    var body: some View {
        RoundedRectangle(cornerRadius: size * 0.225, style: .continuous)
            .fill(LinearGradient(colors: [Self.top, Self.bottom], startPoint: .top, endPoint: .bottom))
            .overlay {
                // Placed as AppIcon.icon/icon.json does: the 1254 px layer at scale 0.9 on a
                // 1024 pt canvas, moved (-39.7, 108) pt, clipped by the icon shape.
                let unit = size / 1024
                Image(.handMirror)
                    .resizable()
                    .frame(width: 1254 * 0.9 * unit, height: 1254 * 0.9 * unit)
                    .offset(x: -39.7 * unit, y: 108 * unit)
                    .shadow(color: .black.opacity(0.3), radius: 20 * unit, y: 6 * unit)
            }
            .clipShape(.rect(cornerRadius: size * 0.225, style: .continuous))
            .frame(width: size, height: size)
            .shadow(color: .black.opacity(0.25), radius: 8, y: 4)
            .accessibilityHidden(true)
    }
}
