import UIKit

/// The menu that appears when the user touches and holds the app icon on the Home Screen. Set at
/// run time so the titles follow the app's language; iOS shows them after the first launch.
enum QuickActions {
    static let modes: [MirrorLaunch.Mode] = [.light, .delayed, .asOthersSee, .guide]

    @MainActor
    static func install() {
        UIApplication.shared.shortcutItems = modes.map { mode in
            UIApplicationShortcutItem(
                type: mode.shortcutType,
                localizedTitle: String(localized: title(of: mode)),
                localizedSubtitle: nil,
                icon: UIApplicationShortcutIcon(systemImageName: symbol(of: mode)),
                userInfo: nil
            )
        }
    }

    /// Passes a chosen quick action on to the mirror. Returns false for an unknown one.
    @MainActor
    @discardableResult
    static func perform(_ item: UIApplicationShortcutItem) -> Bool {
        guard let mode = MirrorLaunch.Mode(shortcutType: item.type) else { return false }
        MirrorLaunch.shared.open(mode)
        return true
    }

    private static func title(of mode: MirrorLaunch.Mode) -> LocalizedStringResource {
        switch mode {
        case .mirror: "Open Mirror"
        case .light: "Mirror + Light"
        case .delayed: "Delayed Mirror, 3 s"
        case .asOthersSee: "As others see you"
        case .guide: "Alignment guide"
        }
    }

    private static func symbol(of mode: MirrorLaunch.Mode) -> String {
        switch mode {
        case .mirror: "person.crop.square"
        case .light: "lightbulb.max"
        case .delayed: "clock.arrow.circlepath"
        case .asOthersSee: "arrow.left.and.right.righttriangle.left.righttriangle.right"
        case .guide: "squareshape.split.2x2.dotted"
        }
    }
}
