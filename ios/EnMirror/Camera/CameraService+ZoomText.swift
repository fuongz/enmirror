import Foundation

extension CameraService {
    /// The zoom factor as the bar and the slider show it, such as "1.5×".
    var zoomText: String {
        Double(zoom).formatted(.number.precision(.fractionLength(1))) + "×"
    }
}
