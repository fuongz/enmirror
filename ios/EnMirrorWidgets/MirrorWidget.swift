import AppIntents
import SwiftUI
import WidgetKit

/// Home Screen (small, medium) and Lock Screen (circular, rectangular) widgets that open the
/// mirror. Nothing changes over time, so the timeline is a single entry.
struct MirrorWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "MirrorWidget", provider: Provider()) { _ in
            MirrorWidgetView()
        }
        .configurationDisplayName("Mirror")
        .description("Opens enMirror to the live mirror.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular])
    }

    struct Entry: TimelineEntry {
        let date: Date
    }

    struct Provider: TimelineProvider {
        func placeholder(in context: Context) -> Entry { Entry(date: .now) }

        func getSnapshot(in context: Context, completion: @escaping (Entry) -> Void) {
            completion(Entry(date: .now))
        }

        func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
            completion(Timeline(entries: [Entry(date: .now)], policy: .never))
        }
    }
}
