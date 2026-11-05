import UIKit

/// A captured still: the original data (saved and shared as is) and its decoded image (shown).
struct FrozenPhoto: Identifiable {
    let id = UUID()
    let data: Data
    let image: UIImage
    let shared: SharedPhoto
    /// Taken in the "as others see you" view, so a pinned copy can follow later flips.
    let asOthersSee: Bool

    init(data: Data, image: UIImage, asOthersSee: Bool = false) {
        self.data = data
        self.image = image
        self.asOthersSee = asOthersSee
        shared = SharedPhoto(data: data)
    }
}
