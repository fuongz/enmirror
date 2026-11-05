import UIKit

/// Pushes the display to full brightness while the ring light is on and gives the
/// user's own brightness back as soon as it is off or the app leaves the foreground.
@MainActor
final class ScreenLight {
    static let shared = ScreenLight()

    private var savedBrightness: CGFloat?

    func setBoosted(_ boosted: Bool) {
        guard let screen = Self.currentScreen else { return }
        if boosted {
            if savedBrightness == nil { savedBrightness = screen.brightness }
            screen.brightness = 1
        } else if let saved = savedBrightness {
            screen.brightness = saved
            savedBrightness = nil
        }
    }

    private static var currentScreen: UIScreen? {
        UIApplication.shared.connectedScenes
            .lazy
            .compactMap { $0 as? UIWindowScene }
            .first?
            .screen
    }
}
