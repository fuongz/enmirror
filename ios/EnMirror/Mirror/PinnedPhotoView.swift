import SwiftUI

/// The pinned photo as a small floating tile over the live mirror, for before/after checks. Drag
/// it to another corner, tap it to look closer, or unpin it. It lives in memory only.
struct PinnedPhotoView: View {
    let photo: FrozenPhoto
    /// Matches the live mirror: the photo is flipped when the view changed after it was taken.
    let flipped: Bool
    @Binding var corner: PinCorner
    let onOpen: () -> Void
    let onUnpin: () -> Void

    @State private var drag: CGSize = .zero

    private static let tile = CGSize(width: 108, height: 144)
    /// Keeps the tile clear of the top buttons and the bottom bar.
    private static let margins = UIEdgeInsets(top: 76, left: 16, bottom: 104, right: 16)

    var body: some View {
        GeometryReader { proxy in
            let area = CGRect(origin: .zero, size: proxy.size).inset(by: Self.margins)
            let center = PinMath.center(of: corner, tile: Self.tile, in: area)
            tileView
                .position(x: center.x + drag.width, y: center.y + drag.height)
                .gesture(
                    DragGesture()
                        .onChanged { drag = $0.translation }
                        .onEnded { value in
                            let end = CGPoint(x: center.x + value.translation.width, y: center.y + value.translation.height)
                            withAnimation(.snappy) {
                                corner = PinMath.nearestCorner(to: end, in: area)
                                drag = .zero
                            }
                        }
                )
        }
    }

    private var tileView: some View {
        Image(uiImage: photo.image)
            .resizable()
            .scaledToFill()
            .scaleEffect(x: flipped ? -1 : 1, y: 1)
            .frame(width: Self.tile.width, height: Self.tile.height)
            .clipShape(.rect(cornerRadius: 16, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 16, style: .continuous).strokeBorder(.white.opacity(0.7), lineWidth: 1.5)
            }
            .shadow(color: .black.opacity(0.4), radius: 8, y: 4)
            .contentShape(.rect)
            .onTapGesture(perform: onOpen)
            .overlay(alignment: .topTrailing) {
                Button(action: onUnpin) {
                    Image(systemName: "xmark")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(.white)
                        .frame(width: 26, height: 26)
                        .glassEffect(.regular.interactive(), in: .circle)
                }
                .buttonStyle(.plain)
                .padding(6)
                .accessibilityLabel(Text("Unpin photo"))
            }
            .accessibilityElement(children: .contain)
            .accessibilityLabel(Text("Pinned photo"))
            .accessibilityAddTraits(.isButton)
            .accessibilityAction(named: Text("Unpin photo"), onUnpin)
    }
}
