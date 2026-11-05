// Values shown on every page. developerName is the seller name on the Apple Developer account;
// `bun run deploy` refuses to build while a page still shows a placeholder such as
// DEVELOPER_NAME_PLACEHOLDER (see scripts/prerender.ts).
export const site = {
  name: "enMirror",
  origin: "https://enmirror.trinhvaphuong.com",
  developerName: "Phuong Phung",
  supportEmail: "support@trinhvaphuong.com",
  /** enMirror is open source under this licence (LICENSE at the repository root). */
  githubUrl: "https://github.com/fuongz/enmirror",
  license: "MIT",
  /** The App Store version, shown under the download button. Keep it in step with MARKETING_VERSION. */
  appVersion: "1.0",
  // The App Store listing, https://apps.apple.com/app/id6830683755 (AppLinks.appStoreID in the
  // iOS app). null until the app is live: the home page and the floating header then say
  // "coming soon" instead of linking to a page that does not exist yet.
  appStoreUrl: null as string | null,
  // Date the privacy policy and terms last changed (YYYY-MM-DD).
  legalUpdated: "2026-11-05",
} as const

export const DEVELOPER_NAME_PLACEHOLDER = "[DEVELOPER_NAME]"
