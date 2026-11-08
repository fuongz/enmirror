import Foundation

/// Every outside address the app shows, in one place. A link that is `nil` is hidden.
enum AppLinks {
    /// enMirror is open source and not on the App Store; people build it from this repository.
    static let sourceCode = URL(string: "https://github.com/fuongz/enmirror")
    static let privacyPolicy = URL(string: "https://enmirror.trinhvaphuong.com/privacy")
    static let support = URL(string: "https://enmirror.trinhvaphuong.com/support")
    /// Public feedback address; the "Send feedback" row appears once this is set.
    static let supportEmail: String? = "support@trinhvaphuong.com"

    /// A `mailto:` link whose subject carries the version, so replies know which build it was.
    static func feedbackMail(to address: String, version: String) -> URL? {
        var components = URLComponents()
        components.scheme = "mailto"
        components.path = address
        components.queryItems = [URLQueryItem(name: "subject", value: "enMirror \(version)")]
        return components.url
    }
}
