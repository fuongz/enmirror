# enMirror

A free iPhone mirror with no ads: a sharp front-camera view, a ring light around the screen, zoom, exposure, freeze-to-inspect and a "how others see you" flip. SwiftUI, iOS 26 and later, fully offline. Open source under the [MIT licence](LICENSE). Conventions: [docs/conventions.md](docs/conventions.md).

**enMirror is not on the App Store.** App Review rejected version 1.0 on 2026-11-08 under guideline 4.3(b) (the mirror category is saturated), so there is no store release: build it and put it on your iPhone yourself, see [Running on an iPhone](#running-on-an-iphone). The release runbook ([docs/runbook.md](docs/runbook.md)) and the App Store guide ([docs/app-store-guide.html](docs/app-store-guide.html)) are kept for reference.

```
enmirror/
├── README.md, LICENSE (MIT), THIRD_PARTY_NOTICES.md
├── mise.toml            tools (SwiftLint, Periphery) and every task: ios:*, testflight:*, web:*
├── docs/                conventions, runbook, App Store guide (both platforms)
├── ios/                 the iPhone app
└── web/                 the landing site (Bun workspace)
```

### ios/

| Path | What |
| --- | --- |
| `ios/EnMirror.xcodeproj`, `ios/EnMirror/` | App target. Files added under `ios/EnMirror/` join the target automatically (synchronized folder). |
| `ios/EnMirror/Camera/` | `CaptureEngine` (AVCaptureSession on its own queue), `CameraService` (`@MainActor @Observable` face the UI observes), `CameraPreview` (preview layer and taps) |
| `ios/EnMirror/Mirror/` | The mirror screen: `MirrorView`, its controls (`GlassCircleButton`, `ShutterButton`, `SliderRow`, `FocusSquare`), the captured still (`FrozenPhoto`, `FrozenPhotoView`, `PhotoActionsBar`, `SharedPhoto`) and canvas `Previews.swift` |
| `ios/EnMirror/About/` | The About sheet (`AboutSheet`, `AppIconBadge`) |
| `ios/EnMirror/Support/` | UIKit-free math (`CameraMath`, `PanMath`, `RingLight`), `SettingsKey`, `AppInfo`, `AppLinks`, screen brightness (`ScreenLight`), saving to Photos (`PhotoLibrary`) |
| `ios/EnMirror/AppIcon.icon` | App icon made in Icon Composer (layers, Liquid Glass, dark and tinted variants). Xcode renders it at build time; open it in Icon Composer to edit. Artwork credit in `THIRD_PARTY_NOTICES.md`. |
| `ios/EnMirror/*.xcstrings` | UI strings and permission prompts; English source, Vietnamese translation |
| `ios/EnMirror/PrivacyInfo.xcprivacy` | Privacy manifest: no tracking, no collected data |
| `ios/EnMirror/Intents/` | App Shortcuts for Siri and Spotlight (`MirrorShortcuts`, phrases in `AppShortcuts.xcstrings`) and the Home Screen quick actions (`QuickActions`, received by `AppDelegate` / `QuickActionSceneDelegate`) |
| `ios/Shared/` | Compiled into both the app and the widget extension: `OpenMirrorIntent`, `OpenMirrorWithLightIntent` and `MirrorLaunch`, which `MirrorView` observes |
| `ios/EnMirrorWidgets/` | Widget extension (`com.trinhvaphuong.enmirror.widgets`): Home Screen (small, medium) and Lock Screen (circular, rectangular) widgets, and Control Center / Lock Screen / Action button controls that open the mirror, with or without the ring light |
| `ios/EnMirrorTests/` | Swift Testing unit tests for the math |
| `ios/Config/Widgets.xcconfig`, `ios/Config/EnMirrorWidgets-Info.plist` | The extension's settings: it includes `Signing.xcconfig` and appends `.widgets` to the app's bundle ID |
| `ios/Config/Signing.xcconfig` | Bundle ID (`com.trinhvaphuong.enmirror`) and signing of the app target. Includes the gitignored `Local.xcconfig`. |
| `ios/scripts/` | `ci-ios.sh` (every check), `testflight.sh` (archive and upload), `ios-swift-files.sh`, and the App Store images: `store-capture.sh` (raw screens on the simulator via the Debug-only `StoreDemo`), `store-screenshots.py`, `store-creative.py` (`mise run ios:store`, output in the gitignored `ios/StoreScreenshots/out/<lang>`) |
| `ios/.swift-format`, `ios/.swiftlint.yml`, `ios/.periphery.yml` | Style, lint and dead-code settings |

### web/

| Path | What |
| --- | --- |
| `web/package.json`, `web/bun.lock` | Bun workspace |
| `web/apps/landing/` | enmirror.trinhvaphuong.com: home (with a playable mirror), privacy, support, terms and brand in Vietnamese and English, prerendered and served by Cloudflare Workers static assets. See its README. |
| `web/scripts/ci-web.sh` | Every landing check: typecheck, release build, required pages, wrangler dry run |

## Build and test

```sh
open ios/EnMirror.xcodeproj  # run the EnMirror scheme; a simulator has no camera, so the mirror says so
mise run ios:test         # unit tests on the simulator in mise.local.toml
mise run ios:ci           # every iOS check (ios/scripts/ci-ios.sh): swift-format, SwiftLint, tests, builds, Periphery
mise run web:ci           # every landing check (web/scripts/ci-web.sh): typecheck, release build, pages, wrangler dry run
mise run web:dev          # landing dev server; web:preview serves dist/ like Cloudflare; web:deploy publishes
```

`mise run ios:format` fixes formatting; `mise run ios:lint` runs both style checks; `mise run ios:dead-code` lists unused declarations.

Per-machine IDs go in `mise.local.toml` (gitignored):

```toml
[env]
ENMIRROR_SIM = "<UDID>"      # xcrun simctl list devices
ENMIRROR_DEVICES = "<UDID> <UDID>"   # iPhones, space-separated: xcrun devicectl list devices
```

## Running on an iPhone

You need a Mac with Xcode 27, an iPhone on iOS 26 or later and an Apple ID (a free one works).

1. `git clone https://github.com/fuongz/enmirror`
2. Signing stays out of git. Copy `ios/Config/Local.xcconfig.example` to `ios/Config/Local.xcconfig` and set `DEVELOPMENT_TEAM` (your Team ID: Xcode › Settings › Accounts). With a free Personal Team, also set an `ENMIRROR_APP_BUNDLE_ID` of your own (such as `com.<you>.enmirror`); the widget extension takes the same ID plus `.widgets`.
3. Turn on Developer Mode on the iPhone (Settings › Privacy & Security), connect it, open `ios/EnMirror.xcodeproj`, pick the iPhone and press Run. Or, with [mise](https://mise.jdx.dev) and the iPhones' UDIDs in `mise.local.toml` (`ENMIRROR_DEVICES = "<UDID> <UDID>"`, from `xcrun devicectl list devices`):

```sh
mise run ios:devices      # build, install and launch on every iPhone in ENMIRROR_DEVICES
```

With a free Apple account the installed app runs for 7 days, then build it again; with a paid Apple Developer account, about a year.

The iPhone must be unlocked, connected by cable or on the same Wi-Fi, with Developer Mode on (Settings › Privacy & Security). Camera, ring light, zoom and freeze can only be checked on a real iPhone.
