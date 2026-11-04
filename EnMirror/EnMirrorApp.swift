import SwiftUI

@main
struct EnMirrorApp: App {
    var body: some Scene {
        WindowGroup {
            MirrorView()
                .preferredColorScheme(.dark)
        }
    }
}
