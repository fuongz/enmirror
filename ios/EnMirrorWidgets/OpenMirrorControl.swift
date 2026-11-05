import SwiftUI
import WidgetKit

/// Control Center, Lock Screen and Action button: opens the live mirror.
struct OpenMirrorControl: ControlWidget {
    var body: some ControlWidgetConfiguration {
        StaticControlConfiguration(kind: "OpenMirror") {
            ControlWidgetButton(action: OpenMirrorIntent()) {
                Label("Mirror", systemImage: "person.crop.square")
            }
        }
        .displayName("Open Mirror")
        .description("Opens enMirror to the live mirror.")
    }
}
