/// The shutter's self-timer: off, 3 s or 10 s. Not saved, so every launch starts with it off.
enum SelfTimer {
    static let choices = [3, 10]

    /// What a shutter press does.
    enum Press: Equatable {
        case capture
        case startCountdown(Int)
        case cancelCountdown
    }

    static func press(timer: Int?, isCounting: Bool) -> Press {
        if isCounting { return .cancelCountdown }
        guard let timer, timer > 0 else { return .capture }
        return .startCountdown(timer)
    }

    /// The numbers shown, one a second: 3, 2, 1.
    static func ticks(from seconds: Int) -> [Int] {
        guard seconds > 0 else { return [] }
        return Array((1...seconds).reversed())
    }
}
