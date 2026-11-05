import CoreGraphics

/// The alignment overlay drawn over the mirror, for checking that both sides match.
enum Guide: String, CaseIterable {
    case off
    case centerLine
    case grid
    case oval

    /// The guide one tap of the button switches to: off → centre line → grid → oval → off.
    var next: Guide {
        let all = Guide.allCases
        let index = all.firstIndex(of: self) ?? 0
        return all[(index + 1) % all.count]
    }

    /// Lines at a third and two thirds of each side.
    static let gridFractions: [CGFloat] = [1.0 / 3.0, 2.0 / 3.0]

    /// A face-sized ellipse centred in `size`: 62% of the width, 1.35 times as tall as wide, and
    /// never taller than 70% of the height, so it shrinks with the mirror when the ring light grows.
    static func ovalRect(in size: CGSize) -> CGRect {
        guard size.width > 0, size.height > 0 else { return .zero }
        let aspect: CGFloat = 1.35
        var width = size.width * 0.62
        var height = width * aspect
        let maxHeight = size.height * 0.7
        if height > maxHeight {
            height = maxHeight
            width = height / aspect
        }
        return CGRect(x: (size.width - width) / 2, y: (size.height - height) / 2, width: width, height: height)
    }
}
