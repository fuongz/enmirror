import SwiftUI
import WidgetKit

@main
struct EnMirrorWidgets: WidgetBundle {
    var body: some Widget {
        MirrorWidget()
        OpenMirrorControl()
        OpenMirrorWithLightControl()
    }
}
