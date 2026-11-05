import CoreGraphics
import Foundation

/// The glowing frame around the mirror.
enum RingLight {
    struct RGB: Equatable {
        var red: Double
        var green: Double
        var blue: Double
    }

    static let warmKelvin = 2700.0
    static let coolKelvin = 6500.0
    static let defaultTone = 0.45
    static let defaultSize = 0.5

    /// `tone` 0 = warm, 1 = cool.
    static func kelvin(forTone tone: Double) -> Double {
        warmKelvin + (coolKelvin - warmKelvin) * CameraMath.clamp(tone, to: 0...1)
    }

    /// Black-body colour approximation (Tanner Helland), components in 0...1.
    static func rgb(kelvin: Double) -> RGB {
        let t = CameraMath.clamp(kelvin, to: 1000...40000) / 100

        let red: Double = t <= 66 ? 255 : 329.698727446 * pow(t - 60, -0.1332047592)
        let green: Double =
            t <= 66
            ? 99.4708025861 * log(t) - 161.1195681661
            : 288.1221695283 * pow(t - 60, -0.0755148492)
        let blue: Double
        if t >= 66 {
            blue = 255
        } else if t <= 19 {
            blue = 0
        } else {
            blue = 138.5177312231 * log(t - 10) - 305.0447927307
        }

        func unit(_ v: Double) -> Double { CameraMath.clamp(v, to: 0...255) / 255 }
        return RGB(red: unit(red), green: unit(green), blue: unit(blue))
    }

    static func rgb(tone: Double) -> RGB { rgb(kelvin: kelvin(forTone: tone)) }

    /// `size` 0...1 maps to a frame of 5%...16% of the screen's shorter side.
    static func inset(size: Double, in bounds: CGSize) -> CGFloat {
        let fraction = 0.05 + 0.11 * CameraMath.clamp(size, to: 0...1)
        return (min(bounds.width, bounds.height) * fraction).rounded()
    }
}
