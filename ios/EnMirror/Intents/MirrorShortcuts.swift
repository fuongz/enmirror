import AppIntents

/// Siri, Spotlight and the Shortcuts app. Phrases are translated in AppShortcuts.xcstrings.
struct MirrorShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: OpenMirrorIntent(),
            phrases: [
                "Open the mirror in \(.applicationName)",
                "Show the mirror in \(.applicationName)",
                "Check myself in \(.applicationName)",
            ],
            shortTitle: "Open Mirror",
            systemImageName: "person.crop.square"
        )
        AppShortcut(
            intent: OpenMirrorWithLightIntent(),
            phrases: [
                "Open the mirror with light in \(.applicationName)",
                "Turn on the ring light in \(.applicationName)",
            ],
            shortTitle: "Mirror + Light",
            systemImageName: "lightbulb.max"
        )
    }
}
