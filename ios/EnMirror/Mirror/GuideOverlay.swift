import SwiftUI

/// Thin white lines over the mirror for the chosen `Guide`. It never takes touches, and it stays
/// on screen only: saved and shared photos are captured from the camera, not from this view.
struct GuideOverlay: View {
    let guide: Guide

    var body: some View {
        Canvas { context, size in
            let path = path(in: size)
            // A soft dark edge keeps the line visible on a bright wall or a white shirt.
            context.stroke(path, with: .color(.black.opacity(0.25)), lineWidth: 2.5)
            context.stroke(path, with: .color(.white.opacity(0.6)), lineWidth: 1)
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }

    private func path(in size: CGSize) -> Path {
        var path = Path()
        switch guide {
        case .off:
            break
        case .centerLine:
            path.move(to: CGPoint(x: size.width / 2, y: 0))
            path.addLine(to: CGPoint(x: size.width / 2, y: size.height))
        case .grid:
            for fraction in Guide.gridFractions {
                path.move(to: CGPoint(x: size.width * fraction, y: 0))
                path.addLine(to: CGPoint(x: size.width * fraction, y: size.height))
                path.move(to: CGPoint(x: 0, y: size.height * fraction))
                path.addLine(to: CGPoint(x: size.width, y: size.height * fraction))
            }
        case .oval:
            path.addEllipse(in: Guide.ovalRect(in: size))
        }
        return path
    }
}
