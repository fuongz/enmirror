import AppIntents

/// Opens enMirror to the live mirror. Compiled into the app (App Shortcuts, Siri, Spotlight) and
/// into the widget extension (Control Center, Lock Screen, Action button); `supportedModes` makes
/// the system launch the app and run `perform()` in the app's process.
struct OpenMirrorIntent: AppIntent {
    static let title: LocalizedStringResource = "Open Mirror"
    // periphery:ignore - read by the App Intents metadata extractor, not by Swift code.
    static let description = IntentDescription("Opens enMirror to the live mirror.")
    static let supportedModes: IntentModes = .foreground(.immediate)

    @MainActor
    func perform() async throws -> some IntentResult {
        MirrorLaunch.shared.open(.mirror)
        return .result()
    }
}
