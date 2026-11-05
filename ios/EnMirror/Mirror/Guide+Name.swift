import SwiftUI

extension Guide {
    /// Shown in the toast when the guide changes.
    var name: LocalizedStringResource {
        switch self {
        case .off: "Guide off"
        case .centerLine: "Center line"
        case .grid: "Grid"
        case .oval: "Face oval"
        }
    }
}
