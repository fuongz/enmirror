import CoreGraphics

enum PinMath {
    /// The corner whose quarter of `area` holds `point`, where a drag ended.
    static func nearestCorner(to point: CGPoint, in area: CGRect) -> PinCorner {
        let leading = point.x < area.midX
        let top = point.y < area.midY
        switch (top, leading) {
        case (true, true): return .topLeading
        case (true, false): return .topTrailing
        case (false, true): return .bottomLeading
        case (false, false): return .bottomTrailing
        }
    }

    /// Centre of a `tile` tucked into `corner` of `area`.
    static func center(of corner: PinCorner, tile: CGSize, in area: CGRect) -> CGPoint {
        let leftX = area.minX + tile.width / 2
        let rightX = area.maxX - tile.width / 2
        let topY = area.minY + tile.height / 2
        let bottomY = area.maxY - tile.height / 2
        switch corner {
        case .topLeading: return CGPoint(x: leftX, y: topY)
        case .topTrailing: return CGPoint(x: rightX, y: topY)
        case .bottomLeading: return CGPoint(x: leftX, y: bottomY)
        case .bottomTrailing: return CGPoint(x: rightX, y: bottomY)
        }
    }
}
