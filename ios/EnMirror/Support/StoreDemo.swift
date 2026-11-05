#if DEBUG
    import UIKit

    /// Debug builds only: App Store screenshots on the simulator, which has no camera.
    /// `-storeDemo <image path>` shows that photo in place of the camera, and `-storeScene <name>`
    /// sets the mirror up for one screenshot (scripts/store-capture.sh drives both).
    enum StoreDemo {
        enum Scene: String {
            case light, zoom, freeze, delay, guide, pin
        }

        static let image: UIImage? = argument(after: "-storeDemo").flatMap(UIImage.init(contentsOfFile:))
        static let scene: Scene? = argument(after: "-storeScene").flatMap(Scene.init(rawValue:))

        static var isOn: Bool { image != nil }

        /// The demo photo as a captured still, the way the shutter would return it.
        static var photoData: Data? { image?.jpegData(compressionQuality: 0.92) }

        private static func argument(after flag: String) -> String? {
            let arguments = ProcessInfo.processInfo.arguments
            guard let index = arguments.firstIndex(of: flag), index + 1 < arguments.count else { return nil }
            return arguments[index + 1]
        }
    }
#endif
