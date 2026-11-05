import CoreGraphics

enum PanMath {
    /// Keeps a scaled image covering its frame: the offset can never reveal an empty edge.
    static func clampedOffset(_ offset: CGSize, scale: CGFloat, size: CGSize) -> CGSize {
        let maxX = max(0, (scale - 1) * size.width / 2)
        let maxY = max(0, (scale - 1) * size.height / 2)
        return CGSize(
            width: CameraMath.clamp(offset.width, to: -maxX...maxX),
            height: CameraMath.clamp(offset.height, to: -maxY...maxY)
        )
    }
}
