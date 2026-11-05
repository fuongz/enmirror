import SwiftUI

/// The shutter's self-timer and its running countdown.
@MainActor
@Observable
final class SelfTimerCountdown {
    /// Seconds, or nil for off. Off at every launch, so a forgotten timer never surprises anyone.
    var timer: Int?
    /// The number on screen while counting down.
    private(set) var remaining: Int?

    @ObservationIgnored private var task: Task<Void, Never>?

    var isCounting: Bool { remaining != nil }

    /// Stops a running countdown without capturing, when the mirror is covered or left.
    func cancel() {
        task?.cancel()
    }

    /// A shutter press: `capture` now, start counting down to it, or cancel the countdown.
    func press(capture: @escaping @MainActor () -> Void) {
        switch SelfTimer.press(timer: timer, isCounting: isCounting) {
        case .capture:
            capture()
        case .cancelCountdown:
            task?.cancel()
        case .startCountdown(let seconds):
            task = Task {
                defer {
                    remaining = nil
                    task = nil
                }
                for tick in SelfTimer.ticks(from: seconds) {
                    withAnimation(.snappy) { remaining = tick }
                    AccessibilityNotification.Announcement("\(tick)").post()
                    try? await Task.sleep(for: .seconds(1))
                    if Task.isCancelled { return }
                }
                capture()
            }
        }
    }
}
