import AppIntents

/// Opens enMirror to the live mirror with the ring light on.
struct OpenMirrorWithLightIntent: AppIntent {
    static let title: LocalizedStringResource = "Open Mirror with Light"
    // periphery:ignore - read by the App Intents metadata extractor, not by Swift code.
    static let description = IntentDescription("Opens enMirror to the live mirror with the ring light on.")
    static let supportedModes: IntentModes = .foreground(.immediate)

    @MainActor
    func perform() async throws -> some IntentResult {
        MirrorLaunch.shared.open(.light)
        return .result()
    }
}
