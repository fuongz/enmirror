import SwiftUI

/// The glass capsule that shows `MirrorToast.current`.
struct MirrorToastView: View {
    let message: MirrorToast.Message?

    var body: some View {
        if let message {
            Text(message.text)
                .font(.subheadline.weight(.semibold))
                .padding(.horizontal, 18)
                .padding(.vertical, 10)
                .glassEffect(.regular, in: .capsule)
                .padding(.top, 8)
                .transition(.move(edge: .top).combined(with: .opacity))
        }
    }
}
