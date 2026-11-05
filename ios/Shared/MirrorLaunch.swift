import Foundation
import Observation

/// The latest request, from an intent, a widget or a Home Screen quick action, to show the live
/// mirror in a given way. `MirrorView` observes it, closes whatever covers the mirror (About
/// sheet, frozen photo) and applies the mode.
@MainActor
@Observable
final class MirrorLaunch {
    /// How the mirror should open.
    enum Mode: String, CaseIterable, Sendable {
        case mirror
        case light
        case delayed
        case asOthersSee
        case guide

        /// `UIApplicationShortcutItem.type` of the quick action for this mode.
        var shortcutType: String { Self.shortcutPrefix + rawValue }

        init?(shortcutType: String) {
            guard shortcutType.hasPrefix(Self.shortcutPrefix) else { return nil }
            self.init(rawValue: String(shortcutType.dropFirst(Self.shortcutPrefix.count)))
        }

        private static let shortcutPrefix = "enmirror.open."
    }

    struct Request: Equatable {
        let id = UUID()
        let mode: Mode

        static func == (lhs: Request, rhs: Request) -> Bool { lhs.id == rhs.id }
    }

    static let shared = MirrorLaunch()

    private(set) var request: Request?

    func open(_ mode: Mode) {
        request = Request(mode: mode)
    }
}
