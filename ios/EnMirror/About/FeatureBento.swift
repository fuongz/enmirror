import SwiftUI

/// What enMirror promises, as a bento of cards with 3D artwork: one wide card (free, with its
/// checklist, artwork on the right) over two half cards (artwork on top, caption below). The
/// artwork's background is the card colour, so each image melts into its card.
struct FeatureBento: View {
    /// #2C2C2E, the dark grouped-row colour and the artwork's background.
    private static let card = Color(red: 44 / 255, green: 44 / 255, blue: 46 / 255)
    private static let radius: CGFloat = 22

    var body: some View {
        VStack(spacing: 12) {
            wideCard
            // As tall as the taller card's content, both cards the same height.
            HStack(spacing: 12) {
                halfCard(image: .aboutRipple, caption: "Works offline, no account needed.")
                halfCard(image: .aboutGlow, caption: "Ring light, zoom and how others see you.")
            }
            .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var wideCard: some View {
        HStack(spacing: 0) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Free")
                    .font(.title2.bold())
                Text("Costs nothing, now or later.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 16)
                VStack(alignment: .leading, spacing: 6) {
                    check("No ads")
                    check("No subscriptions")
                    check("No in-app purchases")
                }
            }
            .padding(18)
            .frame(maxWidth: .infinity, alignment: .leading)

            Image(.aboutRibbons)
                .resizable()
                .scaledToFill()
                .frame(width: 140)
                .clipped()
                .accessibilityHidden(true)
        }
        .frame(height: 200)
        .background(Self.card, in: .rect(cornerRadius: Self.radius, style: .continuous))
        .clipShape(.rect(cornerRadius: Self.radius, style: .continuous))
        .accessibilityElement(children: .combine)
    }

    private func check(_ text: LocalizedStringKey) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 8) {
            Image(systemName: "checkmark.seal.fill")
            Text(text)
        }
        .font(.subheadline)
        .foregroundStyle(.secondary)
    }

    private func halfCard(image: ImageResource, caption: LocalizedStringKey) -> some View {
        // Artwork and caption sit together in the middle of the card.
        VStack(spacing: 6) {
            Image(image)
                .resizable()
                .aspectRatio(3 / 2, contentMode: .fit)
                .accessibilityHidden(true)
            Text(caption)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.horizontal, 12)
        }
        .padding(.bottom, 16)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Self.card, in: .rect(cornerRadius: Self.radius, style: .continuous))
        .clipShape(.rect(cornerRadius: Self.radius, style: .continuous))
        .accessibilityElement(children: .combine)
    }
}
