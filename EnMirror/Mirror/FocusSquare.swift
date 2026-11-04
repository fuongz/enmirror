import SwiftUI

/// The yellow square drawn where the user tapped to meter, like the Camera app's.
struct FocusSquare: View {
    @State private var settled = false

    var body: some View {
        RoundedRectangle(cornerRadius: 4, style: .continuous)
            .stroke(Color.yellow, lineWidth: 1.5)
            .frame(width: 76, height: 76)
            .scaleEffect(settled ? 1 : 1.35)
            .opacity(settled ? 0.9 : 0)
            .onAppear {
                withAnimation(.snappy(duration: 0.25)) { settled = true }
            }
            .allowsHitTesting(false)
            .accessibilityHidden(true)
    }
}
