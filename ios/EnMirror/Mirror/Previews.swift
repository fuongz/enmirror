import SwiftUI

// Canvas previews for the views that render without a camera (⌥⌘↩ in Xcode). The live mirror
// needs a device, so MirrorView has none.

#Preview("Controls") {
    @Previewable @State var tone = RingLight.defaultTone
    @Previewable @State var size = RingLight.defaultSize

    ZStack {
        PreviewSample.backdrop.ignoresSafeArea()
        VStack(spacing: 12) {
            Spacer()
            VStack(spacing: 16) {
                SliderRow(label: "Light tone", minSymbol: "flame", maxSymbol: "snowflake", value: $tone, range: 0...1)
                SliderRow(label: "Light size", minSymbol: "light.min", maxSymbol: "light.max", value: $size, range: 0...1)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .glassEffect(.regular, in: .rect(cornerRadius: 28, style: .continuous))

            GlassEffectContainer(spacing: 14) {
                HStack(spacing: 14) {
                    GlassCircleButton(label: "Light", isActive: true, action: {}) {
                        Image(systemName: "lightbulb.max.fill")
                    }
                    GlassCircleButton(label: "Exposure", action: {}) { Image(systemName: "sun.max") }
                    ShutterButton(isBusy: false, action: {})
                    GlassCircleButton(label: "Zoom", action: {}) { Text(verbatim: "1.0×").font(.system(size: 15, weight: .bold)) }
                    ShutterButton(isBusy: true, action: {})
                }
            }
        }
        .padding()
    }
    .preferredColorScheme(.dark)
}

#Preview("Frozen photo") {
    ZStack(alignment: .bottom) {
        FrozenPhotoView(image: PreviewSample.photo)
            .ignoresSafeArea()
        PhotoActionsBar(photo: PreviewSample.frozen, onSave: {}, onDelete: {})
            .padding(.horizontal, 20)
    }
    .preferredColorScheme(.dark)
}

#Preview("Alignment guides") {
    HStack(spacing: 4) {
        ForEach([Guide.centerLine, .grid, .oval], id: \.self) { guide in
            ZStack {
                PreviewSample.backdrop
                GuideOverlay(guide: guide)
            }
        }
    }
    .ignoresSafeArea()
}

#Preview("Pinned photo and timer") {
    @Previewable @State var corner = PinCorner.topTrailing

    ZStack {
        PreviewSample.backdrop.ignoresSafeArea()
        CountdownNumber(value: 3)
        PinnedPhotoView(photo: PreviewSample.frozen, flipped: false, corner: $corner, onOpen: {}, onUnpin: {})
        VStack {
            Spacer()
            ShutterButton(isBusy: false, timer: 3, isCounting: true, action: {})
        }
        .padding(.bottom, 24)
    }
    .preferredColorScheme(.dark)
}

#Preview("Focus square") {
    ZStack {
        PreviewSample.backdrop.ignoresSafeArea()
        FocusSquare()
    }
}

private enum PreviewSample {
    static let backdrop = LinearGradient(
        colors: [Color(red: 0.55, green: 0.42, blue: 0.36), Color(red: 0.16, green: 0.13, blue: 0.14)],
        startPoint: .top,
        endPoint: .bottom
    )

    static var frozen: FrozenPhoto {
        FrozenPhoto(data: photo.jpegData(compressionQuality: 0.9) ?? Data(), image: photo)
    }

    /// A stand-in for a captured still: a soft gradient with a face-sized oval, so pinch and pan
    /// have something to move.
    static let photo: UIImage = UIGraphicsImageRenderer(size: CGSize(width: 1200, height: 1600)).image { context in
        let colors = [UIColor(red: 0.62, green: 0.5, blue: 0.44, alpha: 1).cgColor, UIColor.black.cgColor]
        if let gradient = CGGradient(colorsSpace: nil, colors: colors as CFArray, locations: [0, 1]) {
            context.cgContext.drawLinearGradient(gradient, start: .zero, end: CGPoint(x: 0, y: 1600), options: [])
        }
        UIColor(red: 0.93, green: 0.78, blue: 0.68, alpha: 1).setFill()
        context.cgContext.fillEllipse(in: CGRect(x: 380, y: 420, width: 440, height: 600))
    }
}
