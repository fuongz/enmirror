import SwiftUI

/// Actions on a captured photo: share it, save it to Photos, pin it over the live mirror to
/// compare, or delete it and return to live.
struct PhotoActionsBar: View {
    let photo: FrozenPhoto
    var isPinned = false
    let onSave: () -> Void
    var onPin: () -> Void = {}
    let onDelete: () -> Void

    var body: some View {
        GlassEffectContainer(spacing: 12) {
            HStack(spacing: 12) {
                ShareLink(
                    item: photo.shared,
                    preview: SharePreview(Text("Photo from enMirror"), image: Image(uiImage: photo.image))
                ) {
                    action("Share", systemImage: "square.and.arrow.up")
                }
                .buttonStyle(.glass)

                Button(action: onSave) {
                    action("Save", systemImage: "square.and.arrow.down")
                }
                .buttonStyle(.glassProminent)

                Button(action: onPin) {
                    action("Pin", systemImage: isPinned ? "pin.fill" : "pin")
                }
                .buttonStyle(.glass)
                .disabled(isPinned)

                Button(role: .destructive, action: onDelete) {
                    action("Delete", systemImage: "trash")
                }
                .buttonStyle(.glass)
            }
            .controlSize(.large)
            .buttonBorderShape(.roundedRectangle(radius: 22))
            .font(.footnote.weight(.semibold))
        }
    }

    private func action(_ title: LocalizedStringKey, systemImage: String) -> some View {
        // Icon above title, so four actions fit across the narrowest iPhone in either language.
        VStack(spacing: 4) {
            Image(systemName: systemImage)
                .font(.system(size: 19, weight: .semibold))
            Text(title)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
        }
        .padding(.vertical, 4)
        .frame(maxWidth: .infinity)
    }
}
