# enMirror

A free iPhone mirror with no ads: a sharp front-camera view, a ring light around the screen, zoom, exposure, freeze-to-inspect and a "how others see you" flip. SwiftUI, iOS 26 and later, fully offline. Conventions: [docs/conventions.md](docs/conventions.md). Releasing: [docs/runbook.md](docs/runbook.md); the step-by-step App Store guide in Vietnamese is [docs/app-store-guide.html](docs/app-store-guide.html) (open it in a browser).

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
| `ios/EnMirrorTests/` | Swift Testing unit tests for the math |
| `ios/Config/Signing.xcconfig` | Bundle ID (`com.trinhvaphuong.enmirror`) and signing of the app target. Includes the gitignored `Local.xcconfig`. |
| `ios/scripts/` | `ci-ios.sh` (every check), `testflight.sh` (archive and upload), `ios-swift-files.sh` |
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
ENMIRROR_DEVICE = "<UDID>"   # xcrun devicectl list devices
```

## Running on an iPhone

Signing stays out of git. Copy `ios/Config/Local.xcconfig.example` to `ios/Config/Local.xcconfig` and set `DEVELOPMENT_TEAM`. With a free Personal Team, also set a development-only `ENMIRROR_APP_BUNDLE_ID` (such as `com.<you>.enmirror.dev`); such builds expire after 7 days.

```sh
mise run ios:device       # build, install and launch on ENMIRROR_DEVICE
```

The iPhone must be unlocked, connected by cable or on the same Wi-Fi, with Developer Mode on (Settings › Privacy & Security). Camera, ring light, zoom and freeze can only be checked on a real iPhone.
