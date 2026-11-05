import SwiftUI
import WidgetKit

/// Control Center, Lock Screen and Action button: opens the live mirror with the ring light on.
struct OpenMirrorWithLightControl: ControlWidget {
    var body: some ControlWidgetConfiguration {
        StaticControlConfiguration(kind: "OpenMirrorWithLight") {
            ControlWidgetButton(action: OpenMirrorWithLightIntent()) {
                Label("Mirror + Light", systemImage: "lightbulb.max")
            }
        }
        .displayName("Mirror + Light")
        .description("Opens enMirror to the live mirror with the ring light on.")
    }
}
