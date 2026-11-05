// Draws the site icons in public/ the way Icon Composer lays out ios/EnMirror/AppIcon.icon: its purple
// gradient (display P3, top to bottom), then the hand-mirror layer at the scale and translation
// icon.json gives (points on a 1024 pt canvas, +y down) with its soft neutral shadow, written as
// sRGB PNGs. Checked against the 120 px icon Xcode renders from the same file.
//
//   swift scripts/make-icons.swift [path/to/AppIcon.icon]
//
// Run from web/apps/landing. The icon defaults to ../../../ios/EnMirror/AppIcon.icon.
// logo.png, icon-192.png and favicon-32.png get rounded corners and a transparent outside, like the
// home screen icon; apple-touch-icon.png is a full-bleed opaque square because iOS rounds it itself.
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let iconDirectory = URL(fileURLWithPath: CommandLine.arguments.dropFirst().first ?? "../../../ios/EnMirror/AppIcon.icon")

/// The one layer's placement, from icon.json.
struct Placement {
    let imageName: String
    let scale: Double
    let translation: CGPoint
    let shadowOpacity: Double
}

func readPlacement() -> Placement? {
    guard
        let data = try? Data(contentsOf: iconDirectory.appendingPathComponent("icon.json")),
        let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
        let group = (json["groups"] as? [[String: Any]])?.first,
        let layer = (group["layers"] as? [[String: Any]])?.first,
        let imageName = layer["image-name"] as? String,
        let position = layer["position"] as? [String: Any],
        let scale = position["scale"] as? Double,
        let translation = position["translation-in-points"] as? [Double], translation.count == 2
    else { return nil }
    let shadow = (group["shadow"] as? [String: Any])?["opacity"] as? Double ?? 0.5
    return Placement(
        imageName: imageName, scale: scale, translation: CGPoint(x: translation[0], y: translation[1]),
        shadowOpacity: shadow)
}

guard let placement = readPlacement() else {
    FileHandle.standardError.write(Data("error: cannot read the layer from \(iconDirectory.path)/icon.json\n".utf8))
    exit(1)
}
let artworkPath = iconDirectory.appendingPathComponent("Assets").appendingPathComponent(placement.imageName).path
let outputDirectory = URL(fileURLWithPath: "public", isDirectory: true)

guard
    let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: artworkPath) as CFURL, nil),
    let artwork = CGImageSourceCreateImageAtIndex(source, 0, nil)
else {
    FileHandle.standardError.write(Data("error: cannot read \(artworkPath)\n".utf8))
    exit(1)
}

let p3 = CGColorSpace(name: CGColorSpace.displayP3)!
let srgb = CGColorSpace(name: CGColorSpace.sRGB)!
let top = CGColor(colorSpace: p3, components: [0.50977, 0.28638, 0.96484, 1])!
let bottom = CGColor(colorSpace: p3, components: [0.19214, 0.07062, 0.52148, 1])!
let gradient = CGGradient(colorsSpace: p3, colors: [top, bottom] as CFArray, locations: [0, 1])!

/// Icon Composer's canvas, and the corner radius of the rounded icons (the iOS home screen proportion).
let canvasPoints = 1024.0
let cornerRatio = 0.2237

func render(size: Int, rounded: Bool) -> CGImage {
    let side = CGFloat(size)
    let rect = CGRect(x: 0, y: 0, width: side, height: side)
    let alpha: CGImageAlphaInfo = rounded ? .premultipliedLast : .noneSkipLast
    let context = CGContext(
        data: nil, width: size, height: size, bitsPerComponent: 8, bytesPerRow: 0,
        space: srgb, bitmapInfo: alpha.rawValue
    )!
    context.interpolationQuality = .high
    if rounded {
        let radius = side * cornerRatio
        context.addPath(CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil))
        context.clip()
    }
    // Core Graphics puts the origin bottom left, so the gradient runs from maxY (top) to 0.
    context.drawLinearGradient(gradient, start: CGPoint(x: 0, y: side), end: .zero, options: [])
    // The layer's pixels count as points on the 1024 pt canvas, then everything scales to `side`.
    let unit = side / canvasPoints
    let width = Double(artwork.width) * placement.scale * unit
    let height = Double(artwork.height) * placement.scale * unit
    let centre = CGPoint(x: side / 2 + placement.translation.x * unit, y: side / 2 - placement.translation.y * unit)
    context.setShadow(
        offset: CGSize(width: 0, height: -12 * unit), blur: 40 * unit,
        color: CGColor(gray: 0, alpha: placement.shadowOpacity * 0.6))
    context.draw(artwork, in: CGRect(x: centre.x - width / 2, y: centre.y - height / 2, width: width, height: height))
    return context.makeImage()!
}

func write(_ image: CGImage, to name: String) {
    let url = outputDirectory.appendingPathComponent(name)
    let destination = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else {
        FileHandle.standardError.write(Data("error: cannot write \(url.path)\n".utf8))
        exit(1)
    }
    print("wrote public/\(name) (\(image.width) × \(image.height))")
}

write(render(size: 512, rounded: true), to: "logo.png")
write(render(size: 192, rounded: true), to: "icon-192.png")
write(render(size: 32, rounded: true), to: "favicon-32.png")
write(render(size: 180, rounded: false), to: "apple-touch-icon.png")
