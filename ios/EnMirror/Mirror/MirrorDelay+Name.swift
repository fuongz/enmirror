import Foundation

extension MirrorDelay {
    /// Shown in the toast and the menu: "Live mirror" or how far behind the mirror runs.
    static func name(_ delay: Double?) -> LocalizedStringResource {
        guard let delay else { return "Live mirror" }
        return "Mirror \(Int(delay)) s behind"
    }
}
