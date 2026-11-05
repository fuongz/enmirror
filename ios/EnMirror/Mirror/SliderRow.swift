import SwiftUI

/// One slider with an icon at each end.
struct SliderRow: View {
    let label: LocalizedStringKey
    let minSymbol: String
    let maxSymbol: String
    @Binding var value: Double
    let range: ClosedRange<Double>
    var valueText: String?

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: minSymbol)
                .frame(width: 24)
            Slider(value: $value, in: range)
                .accessibilityLabel(Text(label))
            Image(systemName: maxSymbol)
                .frame(width: 24)
            if let valueText {
                Text(verbatim: valueText)
                    .font(.footnote.monospacedDigit().weight(.semibold))
                    .frame(width: 44, alignment: .trailing)
            }
        }
        .font(.body.weight(.medium))
        .foregroundStyle(.white)
    }
}
