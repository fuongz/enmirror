// Draws localized social sharing cards using the existing enMirror logo.
// Run on macOS from web/apps/landing: swift scripts/make-og-images.swift
// Outputs opaque sRGB PNGs at 1200 × 630; no third-party dependencies.
import AppKit
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let width = 1200
let height = 630
let srgb = CGColorSpace(name: CGColorSpace.sRGB)!
let root = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
let outputDirectory = root.appendingPathComponent("public/og", isDirectory: true)
guard let logo = NSImage(contentsOf: root.appendingPathComponent("public/logo.png")) else {
    fatalError("Cannot read public/logo.png; run scripts/make-icons.swift first.")
}
try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

let ink = NSColor(srgbRed: 0.12, green: 0.08, blue: 0.18, alpha: 1)
let purple = NSColor(srgbRed: 112 / 255, green: 44 / 255, blue: 219 / 255, alpha: 1)
let muted = NSColor(srgbRed: 0.43, green: 0.39, blue: 0.49, alpha: 1)

func text(_ value: String, at point: CGPoint, font: NSFont, color: NSColor) {
    // draw(at:) preserves ascenders and Vietnamese tone marks without a tight clipping box.
    (value as NSString).draw(at: point, withAttributes: [.font: font, .foregroundColor: color])
}

func serif(_ size: CGFloat) -> NSFont {
    NSFont(name: "Georgia", size: size) ?? NSFont.systemFont(ofSize: size, weight: .regular)
}

func render(language: String) throws {
    let context = CGContext(
        data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0,
        space: srgb, bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
    )!
    context.translateBy(x: 0, y: CGFloat(height))
    context.scaleBy(x: 1, y: -1)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: true)
    defer { NSGraphicsContext.restoreGraphicsState() }

    let canvas = CGRect(x: 0, y: 0, width: width, height: height)
    NSColor(srgbRed: 0.988, green: 0.98, blue: 1, alpha: 1).setFill()
    canvas.fill()

    // A quiet lavender field grounds the icon while leaving the headline crisp.
    let glow = CGGradient(
        colorsSpace: srgb,
        colors: [
            CGColor(colorSpace: srgb, components: [0.88, 0.8, 1, 0.85])!,
            CGColor(colorSpace: srgb, components: [0.98, 0.96, 1, 0])!,
        ] as CFArray,
        locations: [0, 1]
    )!
    context.drawRadialGradient(
        glow, startCenter: CGPoint(x: 990, y: 325), startRadius: 0,
        endCenter: CGPoint(x: 990, y: 325), endRadius: 230, options: []
    )

    text("enMirror", at: CGPoint(x: 72, y: 58), font: .systemFont(ofSize: 34, weight: .semibold), color: ink)
    text(language == "vi" ? "Gương soi cho iPhone" : "A mirror for your iPhone",
         at: CGPoint(x: 73, y: 106), font: .systemFont(ofSize: 19), color: muted)

    if language == "vi" {
        text("Soi rõ,", at: CGPoint(x: 66, y: 189), font: serif(88), color: ink)
        text("sáng đủ.", at: CGPoint(x: 66, y: 288), font: serif(88), color: ink)
        text("Miễn phí, không quảng cáo.", at: CGPoint(x: 73, y: 425),
             font: .systemFont(ofSize: 32, weight: .medium), color: purple)
    } else {
        text("A clearer view.", at: CGPoint(x: 68, y: 209), font: serif(69), color: ink)
        text("A little light.", at: CGPoint(x: 68, y: 295), font: serif(69), color: ink)
        text("Free. No ads.", at: CGPoint(x: 73, y: 425),
             font: .systemFont(ofSize: 32, weight: .medium), color: purple)
    }

    context.saveGState()
    context.translateBy(x: 964, y: 313)
    context.rotate(by: 7 * .pi / 180)
    let shadow = NSShadow()
    shadow.shadowColor = NSColor(srgbRed: 0.31, green: 0.1, blue: 0.54, alpha: 0.18)
    shadow.shadowBlurRadius = 30
    shadow.shadowOffset = CGSize(width: 0, height: 16)
    shadow.set()
    logo.draw(in: CGRect(x: -145, y: -145, width: 290, height: 290), from: .zero,
              operation: .sourceOver, fraction: 1, respectFlipped: true, hints: [.interpolation: NSImageInterpolation.high])
    context.restoreGState()

    NSColor(srgbRed: 0.83, green: 0.8, blue: 0.89, alpha: 1).setFill()
    CGRect(x: 72, y: 527, width: 1056, height: 1).fill()
    text("enmirror.trinhvaphuong.com", at: CGPoint(x: 73, y: 551), font: .systemFont(ofSize: 19), color: muted)
    let label = language == "vi" ? "MÃ NGUỒN MỞ" : "OPEN SOURCE"
    let labelFont = NSFont.systemFont(ofSize: 13, weight: .semibold)
    let labelWidth = (label as NSString).size(withAttributes: [.font: labelFont]).width
    text(label, at: CGPoint(x: 1128 - labelWidth, y: 557), font: labelFont, color: muted)

    guard let image = context.makeImage(),
          let destination = CGImageDestinationCreateWithURL(
            outputDirectory.appendingPathComponent("\(language).png") as CFURL,
            UTType.png.identifier as CFString, 1, nil
          ) else { fatalError("Cannot create OG PNG") }
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else { fatalError("Cannot write OG PNG") }
    print("wrote public/og/\(language).png (\(image.width) × \(image.height))")
}

try render(language: "vi")
try render(language: "en")
