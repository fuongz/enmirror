import SwiftUI

/// What enMirror is (a bento of feature cards), its language, support and privacy links, credits and version.
struct AboutSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var copiedVersion = false
    // periphery:ignore - read and written through `$detent` by presentationDetents, which Periphery does not see
    @State private var detent = Self.initialDetent

    /// Debug builds launched with `-showAbout` open it full height, for simulator screenshots.
    private static var initialDetent: PresentationDetent {
        #if DEBUG
            ProcessInfo.processInfo.arguments.contains("-showAbout") ? .large : .medium
        #else
            .medium
        #endif
    }

    private let version = AppInfo.version

    var body: some View {
        NavigationStack {
            List {
                header
                highlights
                language
                links
                acknowledgements
                versionRow
            }
            .listStyle(.insetGrouped)
            .labelStyle(.topAligned)
            .navigationTitle(Text("About"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large], selection: $detent)
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
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
        }
        .listRowBackground(Color.clear)
    }

    private var highlights: some View {
        Section {
            FeatureBento()
                .listRowInsets(EdgeInsets())
        }
        .listRowBackground(Color.clear)
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
            if let url = AppLinks.privacyPolicy {
                Link(destination: url) { Label("Privacy Policy", systemImage: "hand.raised") }
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

    /// The version people quote in a support request; tapping copies it.
    private var versionRow: some View {
        Section {
            Button {
                UIPasteboard.general.string = version
                copiedVersion = true
            } label: {
                LabeledContent {
                    Group {
                        if copiedVersion {
                            Text("Copied")
                        } else {
                            Text(verbatim: version)
                        }
                    }
                    .monospacedDigit()
                } label: {
                    Label("Version", systemImage: copiedVersion ? "checkmark.circle" : "info.circle")
                }
            }
            .foregroundStyle(.primary)
            .accessibilityHint(Text("Copies the version for a support request"))
        }
    }
}
