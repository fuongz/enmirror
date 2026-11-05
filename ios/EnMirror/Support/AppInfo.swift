import Foundation

/// The version people quote when they ask for help, as Settings would show it.
enum AppInfo {
    static var version: String {
        let info = Bundle.main.infoDictionary
        return versionText(
            short: info?["CFBundleShortVersionString"] as? String,
            build: info?["CFBundleVersion"] as? String
        )
    }

    /// The language the app is showing, named in that language ("Tiếng Việt", "English").
    static var currentLanguageName: String {
        languageName(for: Bundle.main.preferredLocalizations.first ?? "en")
    }

    static func languageName(for code: String) -> String {
        let locale = Locale(identifier: code)
        let name = locale.localizedString(forLanguageCode: code) ?? code
        return name.prefix(1).uppercased(with: locale) + name.dropFirst()
    }

    /// "1.0 (202611051230)"; the build is dropped when it is missing or the same as the version.
    static func versionText(short: String?, build: String?) -> String {
        switch (short, build) {
        case let (short?, build?) where build != short: "\(short) (\(build))"
        case let (short?, _): short
        case let (nil, build?): build
        case (nil, nil): "–"
        }
    }
}
