import SwiftUI

/// The short message at the top of the mirror ("Saved to Photos", a mode's name). A newer
/// message replaces the current one; each hides itself after a moment.
@MainActor
@Observable
final class MirrorToast {
    struct Message: Equatable {
        let id = UUID()
        let text: LocalizedStringResource

        static func == (lhs: Message, rhs: Message) -> Bool { lhs.id == rhs.id }
    }

    private(set) var current: Message?

    func show(_ text: LocalizedStringResource) {
        let next = Message(text: text)
        current = next
        Task {
            // Cancelling this sleep is harmless: the next message has already replaced this one.
            try? await Task.sleep(for: .seconds(1.6))
            if current == next { current = nil }
        }
    }
}
