import UIKit

/// A captured still: the original data (saved and shared as is) and its decoded image (shown).
struct FrozenPhoto: Identifiable {
    let id = UUID()
    let data: Data
    let image: UIImage
    let shared: SharedPhoto

    init(data: Data, image: UIImage) {
        self.data = data
        self.image = image
        shared = SharedPhoto(data: data)
    }
}
