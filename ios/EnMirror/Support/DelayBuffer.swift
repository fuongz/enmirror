/// Holds frames until they are `delay` seconds old, by their capture timestamps, so the delayed
/// mirror never drifts from the camera's own clock.
struct DelayBuffer<Frame> {
    let delay: Double
    private var queued: [(time: Double, frame: Frame)] = []

    init(delay: Double) {
        self.delay = delay
    }

    // periphery:ignore - read by the unit tests.
    var count: Int { queued.count }

    /// Adds the frame captured at `time` and returns the newest frame that is now at least
    /// `delay` old, if any; older ones are dropped, so the buffer holds about `delay` seconds.
    mutating func push(_ frame: Frame, at time: Double) -> Frame? {
        queued.append((time, frame))
        var due: Frame?
        while let first = queued.first, first.time <= time - delay {
            due = first.frame
            queued.removeFirst()
        }
        return due
    }

    mutating func removeAll() {
        queued.removeAll()
    }
}
