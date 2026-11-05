import SwiftUI

/// A label whose icon lines up with the first line of its title, so multi-line rows (tips,
/// the privacy note) keep the icon at the top instead of floating at the middle.
struct TopAlignedLabelStyle: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 16) {
            configuration.icon
                .frame(width: 24)
            configuration.title
        }
    }
}

extension LabelStyle where Self == TopAlignedLabelStyle {
    static var topAligned: TopAlignedLabelStyle { TopAlignedLabelStyle() }
}
