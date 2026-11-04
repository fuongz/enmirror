// Renders the enMirror app icon: swift scripts/make-icon.swift <output.png>
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

/// A script has no one to recover for: stop with a message instead of force-unwrapping.
func required<T>(_ value: T?, _ what: String) -> T {
    guard let value else { fatalError("could not create \(what)") }
    return value
}

let size = 1024
let out = CommandLine.arguments.dropFirst().first ?? "AppIcon.png"
let space = required(CGColorSpace(name: CGColorSpace.sRGB), "sRGB colour space")
let ctx = required(
    CGContext(
        data: nil, width: size, height: size, bitsPerComponent: 8, bytesPerRow: 0,
        space: space, bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue),
    "bitmap context")
func rgb(_ r: CGFloat, _ g: CGFloat, _ b: CGFloat, _ a: CGFloat = 1) -> CGColor {
    required(CGColor(colorSpace: space, components: [r, g, b, a]), "colour")
}
func gradient(_ colors: [CGColor], _ locations: [CGFloat]) -> CGGradient {
    required(CGGradient(colorsSpace: space, colors: colors as CFArray, locations: locations), "gradient")
}
let c = CGPoint(x: 512, y: 512)

// Background: deep charcoal, lighter toward the top.
let bg = gradient([rgb(0.17, 0.17, 0.18), rgb(0.05, 0.05, 0.06)], [0, 1])
ctx.drawLinearGradient(bg, start: CGPoint(x: 512, y: 1024), end: CGPoint(x: 512, y: 0), options: [])

// Warm glow behind the ring.
let glow = gradient([rgb(1, 0.78, 0.42, 0.55), rgb(1, 0.78, 0.42, 0)], [0, 1])
ctx.drawRadialGradient(glow, startCenter: c, startRadius: 300, endCenter: c, endRadius: 470, options: [])

// Light ring.
ctx.setFillColor(rgb(1, 0.86, 0.6))
ctx.fillEllipse(in: CGRect(x: 512 - 352, y: 512 - 352, width: 704, height: 704))

// Mirror glass.
let glassRect = CGRect(x: 512 - 316, y: 512 - 316, width: 632, height: 632)
ctx.saveGState()
ctx.addEllipse(in: glassRect)
ctx.clip()
let glass = gradient([rgb(0.93, 0.94, 0.96), rgb(0.62, 0.65, 0.70), rgb(0.33, 0.35, 0.39)], [0, 0.55, 1])
ctx.drawLinearGradient(glass, start: CGPoint(x: 260, y: 820), end: CGPoint(x: 780, y: 200), options: [])
// Diagonal highlights.
ctx.setFillColor(rgb(1, 1, 1, 0.35))
for (offset, width) in [(-90.0, 70.0), (40.0, 26.0)] {
    ctx.saveGState()
    ctx.translateBy(x: 512, y: 512)
    ctx.rotate(by: -.pi / 4)
    ctx.fill(CGRect(x: offset, y: -400, width: width, height: 800))
    ctx.restoreGState()
}
ctx.restoreGState()

let image = required(ctx.makeImage(), "image")
let dest = required(
    CGImageDestinationCreateWithURL(URL(fileURLWithPath: out) as CFURL, UTType.png.identifier as CFString, 1, nil),
    "PNG destination")
CGImageDestinationAddImage(dest, image, nil)
guard CGImageDestinationFinalize(dest) else { fatalError("write failed") }
print("wrote \(out)")
