import SwiftUI

@main
struct EnMirrorApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate

    var body: some Scene {
        WindowGroup {
            MirrorView()
                .preferredColorScheme(.dark)
                .task { QuickActions.install() }
        }
    }
}
