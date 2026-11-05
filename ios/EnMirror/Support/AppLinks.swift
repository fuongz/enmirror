import Foundation

/// Every outside address the app shows, in one place. A link that is `nil` is hidden.
enum AppLinks {
    static let appStoreID = "6830683755"
    static let writeReview = URL(string: "https://apps.apple.com/app/id\(appStoreID)?action=write-review")
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
