import SwiftUI

/// What enMirror is, its version, how to get the most from it, privacy, links and credits.
struct AboutSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var copiedVersion = false

    private let version = AppInfo.version

    var body: some View {
        NavigationStack {
            List {
                header
                highlights
                tips
                language
                privacy
                links
                acknowledgements
            }
            .listStyle(.insetGrouped)
            .navigationTitle(Text("About"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .sensoryFeedback(.success, trigger: copiedVersion) { _, copied in copied }
        .task(id: copiedVersion) {
            guard copiedVersion else { return }
            try? await Task.sleep(for: .seconds(1.5))
            copiedVersion = false
        }
    }

    private var header: some View {
        Section {
            VStack(spacing: 10) {
                AppIconBadge()
                Text(verbatim: "enMirror")
                    .font(.title2.bold())
                Text("A clear mirror with a ring light. Free, with no ads.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                Button {
                    UIPasteboard.general.string = version
                    copiedVersion = true
                } label: {
                    Label {
                        Text(copiedVersion ? "Copied" : "Version \(version)")
                    } icon: {
                        Image(systemName: copiedVersion ? "checkmark" : "doc.on.doc")
                    }
                    .font(.footnote.monospacedDigit())
                }
                .buttonStyle(.borderless)
                .accessibilityHint(Text("Copies the version for a support request"))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
        }
        .listRowBackground(Color.clear)
    }

    private var highlights: some View {
        Section {
            Label("Free forever: no ads, no subscriptions, no in-app purchases", systemImage: "gift")
            Label("Works offline, with no account", systemImage: "wifi.slash")
            Label("Ring light, zoom and a true view of how others see you", systemImage: "sparkles")
        }
    }

    private var tips: some View {
        Section("Tips") {
            Label(
                "Tap the mirror to set the exposure there. On iPhone 14 and later it focuses there too.",
                systemImage: "hand.tap"
            )
            Label("Pinch to zoom, double-tap to go back to 1×.", systemImage: "arrow.up.left.and.arrow.down.right")
            Label(
                "Hold your iPhone about 30 cm from your face: the front camera is sharpest there.",
                systemImage: "ruler"
            )
            Label("In a dim room, turn on the ring light.", systemImage: "lightbulb")
        }
    }

    /// iOS keeps a per-app language in Settings once an app ships two localizations; switching
    /// there also translates the permission prompts, which an in-app switch could not.
    @ViewBuilder
    private var language: some View {
        if let url = URL(string: UIApplication.openSettingsURLString) {
            Section {
                Link(destination: url) {
                    LabeledContent {
                        Text(verbatim: AppInfo.currentLanguageName)
                    } label: {
                        Label("Language", systemImage: "globe")
                    }
                }
            } footer: {
                Text("Opens Settings › enMirror › Language. enMirror restarts in the language you pick.")
            }
        }
    }

    private var privacy: some View {
        Section {
            Label(
                "enMirror collects no data. The camera image stays on your iPhone, nothing is uploaded, and a photo is saved only when you tap Save.",
                systemImage: "lock.shield"
            )
            if let url = AppLinks.privacyPolicy {
                Link(destination: url) { Label("Privacy Policy", systemImage: "hand.raised") }
            }
        } header: {
            Text("Privacy")
        }
    }

    private var links: some View {
        Section("Support") {
            if let url = AppLinks.writeReview {
                Link(destination: url) { Label("Rate enMirror on the App Store", systemImage: "star") }
            }
            if let address = AppLinks.supportEmail, let url = AppLinks.feedbackMail(to: address, version: version) {
                Link(destination: url) { Label("Send Feedback", systemImage: "envelope") }
            }
            if let url = AppLinks.support {
                Link(destination: url) { Label("Help & Support", systemImage: "questionmark.circle") }
            }
        }
    }

    private var acknowledgements: some View {
        Section("Acknowledgements") {
            Label("App icon: original artwork made for enMirror.", systemImage: "paintpalette")
            Label("Symbols: SF Symbols by Apple.", systemImage: "square.grid.2x2")
        }
        .font(.footnote)
        .foregroundStyle(.secondary)
    }
}
