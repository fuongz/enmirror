import SwiftUI

/// The big countdown number in the middle of the mirror.
struct CountdownNumber: View {
    let value: Int

    var body: some View {
        Text(verbatim: "\(value)")
            .font(.system(size: 140, weight: .bold, design: .rounded).monospacedDigit())
            .foregroundStyle(.white)
            .shadow(color: .black.opacity(0.5), radius: 12)
            .contentTransition(.numericText(countsDown: true))
            .allowsHitTesting(false)
            // VoiceOver hears each second through an announcement instead.
            .accessibilityHidden(true)
    }
}
