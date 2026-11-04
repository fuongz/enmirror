import SwiftUI

/// Actions on a captured photo: share it, save it to Photos, or delete it and return to live.
struct PhotoActionsBar: View {
    let photo: FrozenPhoto
    let onSave: () -> Void
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

                Button(role: .destructive, action: onDelete) {
                    action("Delete", systemImage: "trash")
                }
                .buttonStyle(.glass)
            }
            .controlSize(.extraLarge)
            .font(.headline)
        }
    }

    private func action(_ title: LocalizedStringKey, systemImage: String) -> some View {
        Label(title, systemImage: systemImage)
            .labelStyle(.titleAndIcon)
            .lineLimit(1)
            .frame(maxWidth: .infinity)
    }
}
