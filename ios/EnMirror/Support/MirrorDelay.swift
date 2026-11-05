/// The delayed mirror's settings: how far behind it runs, picked by tapping its button.
enum MirrorDelay {
    /// Seconds: enough to turn around and look back, small enough to keep memory low.
    static let choices: [Double] = [2, 3, 5]

    /// Off → 2 s → 3 s → 5 s → off.
    static func next(after current: Double?) -> Double? {
        guard let current, let index = choices.firstIndex(of: current) else { return choices.first }
        return index + 1 < choices.count ? choices[index + 1] : nil
    }

    /// Long side of the frames kept in memory. About 1 MB each in 4:3, so 5 s at 30 fps stays near 160 MB.
    static let frameLongSide = 960
}
