# enMirror

A free iPhone mirror with no ads: a sharp front-camera view, a ring light around the screen, zoom, exposure, freeze-to-inspect and a "how others see you" flip. SwiftUI, iOS 26 and later, fully offline. Conventions: [docs/conventions.md](docs/conventions.md). Releasing: [docs/runbook.md](docs/runbook.md); the step-by-step App Store guide in Vietnamese is [docs/app-store-guide.html](docs/app-store-guide.html) (open it in a browser).

| Path | What |
| --- | --- |
| `EnMirror.xcodeproj`, `EnMirror/` | App target. Files added under `EnMirror/` join the target automatically (synchronized folder). |
| `EnMirror/Camera/` | `CaptureEngine` (AVCaptureSession on its own queue), `CameraService` (`@MainActor @Observable` face the UI observes), `CameraPreview` (preview layer bridge) |
| `EnMirror/Mirror/` | The mirror screen: `MirrorView`, its controls (`GlassCircleButton`, `FreezeButton`, `SliderRow`), the frozen still (`FrozenPhoto`, `FrozenPhotoView`) and canvas `Previews.swift` |
| `EnMirror/Support/` | UIKit-free math (`CameraMath`, `PanMath`, `RingLight`), `SettingsKey`, screen brightness (`ScreenLight`), saving to Photos (`PhotoLibrary`) |
| `EnMirror/*.xcstrings` | UI strings and permission prompts; English source, Vietnamese translation |
| `EnMirror/PrivacyInfo.xcprivacy` | Privacy manifest: no tracking, no collected data |
| `EnMirrorTests/` | Swift Testing unit tests for the math |
| `Config/Signing.xcconfig` | Bundle ID (`com.trinhvaphuong.enmirror`) and signing of the app target. Includes the gitignored `Local.xcconfig`. |
| `scripts/` | `ci-ios.sh` (every check), `testflight.sh` (archive and upload), `make-icon.swift` (renders the app icon), `ios-swift-files.sh` |
| `mise.toml` | Pinned SwiftLint and Periphery, and the `ios:*` / `testflight:*` tasks (`mise tasks` lists them) |

## Build and test

```sh
open EnMirror.xcodeproj   # run the EnMirror scheme; a simulator has no camera, so the mirror says so
mise run ios:test         # unit tests on the simulator in mise.local.toml
scripts/ci-ios.sh         # every check: swift-format, SwiftLint, tests, simulator and device builds, Periphery
```

`mise run ios:format` fixes formatting; `mise run ios:lint` runs both style checks; `mise run ios:dead-code` lists unused declarations.

Per-machine IDs go in `mise.local.toml` (gitignored):

```toml
[env]
ENMIRROR_SIM = "<UDID>"      # xcrun simctl list devices
ENMIRROR_DEVICE = "<UDID>"   # xcrun devicectl list devices
```

## Running on an iPhone

Signing stays out of git. Copy `Config/Local.xcconfig.example` to `Config/Local.xcconfig` and set `DEVELOPMENT_TEAM`. With a free Personal Team, also set a development-only `ENMIRROR_APP_BUNDLE_ID` (such as `com.<you>.enmirror.dev`); such builds expire after 7 days.

```sh
mise run ios:device       # build, install and launch on ENMIRROR_DEVICE
```

The iPhone must be unlocked, connected by cable or on the same Wi-Fi, with Developer Mode on (Settings › Privacy & Security). Camera, ring light, zoom and freeze can only be checked on a real iPhone.
