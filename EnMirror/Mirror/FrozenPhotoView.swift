import SwiftUI

/// A captured still the user can pinch and pan around to check detail.
struct FrozenPhotoView: View {
    let image: UIImage

    @State private var scale: CGFloat = 1
    @State private var baseScale: CGFloat = 1
    @State private var offset: CGSize = .zero
    @State private var baseOffset: CGSize = .zero

    private let maxScale: CGFloat = 6
    private let doubleTapScale: CGFloat = 2.5

    var body: some View {
        GeometryReader { proxy in
            Image(uiImage: image)
                .resizable()
                .scaledToFill()
                .frame(width: proxy.size.width, height: proxy.size.height)
                .scaleEffect(scale)
                .offset(offset)
                .contentShape(.rect)
                .gesture(magnify(in: proxy.size).simultaneously(with: pan(in: proxy.size)))
                .onTapGesture(count: 2) { toggleZoom(in: proxy.size) }
        }
        .accessibilityLabel(Text("Frozen photo"))
    }

    private func magnify(in size: CGSize) -> some Gesture {
        MagnifyGesture()
            .onChanged { value in
                scale = CameraMath.clamp(baseScale * value.magnification, to: 1...maxScale)
                offset = PanMath.clampedOffset(offset, scale: scale, size: size)
            }
            .onEnded { _ in
                baseScale = scale
                baseOffset = offset
            }
    }

    private func pan(in size: CGSize) -> some Gesture {
        DragGesture(minimumDistance: 4)
            .onChanged { value in
                let proposed = CGSize(
                    width: baseOffset.width + value.translation.width,
                    height: baseOffset.height + value.translation.height
                )
                offset = PanMath.clampedOffset(proposed, scale: scale, size: size)
            }
            .onEnded { _ in baseOffset = offset }
    }

    private func toggleZoom(in size: CGSize) {
        withAnimation(.snappy) {
            scale = scale > 1 ? 1 : doubleTapScale
            offset = PanMath.clampedOffset(offset, scale: scale, size: size)
            baseScale = scale
            baseOffset = offset
        }
    }
}
