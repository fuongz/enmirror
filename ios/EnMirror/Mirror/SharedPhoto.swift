import CoreTransferable
import ImageIO
import UniformTypeIdentifiers

/// The captured photo as the share sheet sees it: the original bytes, so nothing is recompressed.
/// `CaptureEngine` writes HEIC when the device encodes HEVC and JPEG otherwise; the matching
/// representation is the only one offered.
struct SharedPhoto: Transferable {
    let data: Data
    let isHEIC: Bool

    init(data: Data) {
        self.data = data
        let type = CGImageSourceCreateWithData(data as CFData, nil).flatMap(CGImageSourceGetType)
        isHEIC = (type as String?).flatMap(UTType.init)?.conforms(to: .heic) ?? false
    }

    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .heic) { $0.data }
            .suggestedFileName("enMirror.heic")
            .exportingCondition { $0.isHEIC }
        DataRepresentation(exportedContentType: .jpeg) { $0.data }
            .suggestedFileName("enMirror.jpg")
            .exportingCondition { !$0.isHEIC }
    }
}
