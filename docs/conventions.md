# Conventions and standards

How code, files, tooling and history are organised in enMirror. These rules come from Enchat (`fuongz/enchat`, mostly `apps/ios/README.md`, `apps/ios/.swift-format`, `apps/ios/.swiftlint.yml`, `ios/scripts/ci-ios.sh`, `docs/technical/ios-clean-code-audit.md`) and are scaled down for a single-screen app. When a rule here and Enchat disagree, this file wins for this repo.

## Platform

| | |
| --- | --- |
| Deployment target | iOS 26 (Liquid Glass APIs: `glassEffect`, `GlassEffectContainer`, `.buttonStyle(.glass)`) |
| Toolchain | Xcode 27, iOS 27 SDK, Swift 6 language mode (strict concurrency) |
| UI | SwiftUI only; UIKit through `UIViewRepresentable` where SwiftUI has no API (camera preview) |
| Devices | iPhone, portrait only, dark appearance |
| Dependencies | None. Add one only when the platform truly lacks it, pin it with `exact:` and record it in `THIRD_PARTY_NOTICES.md` |

## Repository layout

The root holds only what spans the whole repo; each platform lives in its own folder with its own
scripts and tool settings, and mise runs every task from the root.

```
README.md, LICENSE, THIRD_PARTY_NOTICES.md, mise.toml, AGENTS.md
docs/                         This file, the runbook, the App Store guide; later ADRs (docs/adr/NNNN-title.md)
ios/
  EnMirror.xcodeproj          Synchronized folders: files added under EnMirror/, EnMirrorTests/, EnMirrorWidgets/ or Shared/ join their targets, no project edits
  EnMirror/                   App target
    EnMirrorApp.swift         @main; only hosts the root view
    Camera/                   AVFoundation: session engine, @Observable service, preview bridge
    Mirror/                   The mirror screen and its controls (one feature folder)
    About/                    The About sheet
    Support/                  Pure logic and small platform helpers (math, links, screen brightness, Photos)
    AppIcon.icon              App icon made in Icon Composer (Liquid Glass, dark and tinted variants)
    Assets.xcassets           Accent colour, artwork
    Localizable.xcstrings     UI strings
    InfoPlist.xcstrings       Permission prompts and display name
    Intents/                  App Shortcuts (Siri, Spotlight), Home Screen quick actions, their app and scene delegates
  EnMirrorWidgets/            Widget extension: Home Screen and Lock Screen widgets; Control Center / Lock Screen / Action button controls
  Shared/                     Compiled into the app and the extension: the open-mirror intents and `MirrorLaunch`
  EnMirrorTests/              Swift Testing unit tests
  Config/                     Signing.xcconfig (bundle ID, version for app and extension), Widgets.xcconfig; Local.xcconfig (gitignored) holds the team
  scripts/                    ci-ios.sh, testflight.sh, ios-swift-files.sh
  .swift-format, .swiftlint.yml, .periphery.yml
web/                          Bun workspace (same shape as enchat)
  apps/landing/               The Cloudflare landing site
  scripts/                    ci-web.sh
```

**When it grows** (a widget, a second target, shared code), do as Enchat did: keep the Xcode project as a thin host and move the code into a local package (`EnMirrorKit/Sources/<Module>`) with modules in dependency order, a design-system module that is SwiftUI only, and feature folders `App/`, `Features/<Name>/`, `Shared/`, `Previews/` in the UI module.

## Files and types

- **One main type per file, named after it.** Extensions are `Type+Feature.swift`. A small `private` type used by one view may stay in that view's file.
- Size limits, enforced by SwiftLint: files ≤ 500 lines, types ≤ 300, functions ≤ 60, cyclomatic complexity ≤ 15 (`switch` cases not counted). Split before you reach them; a `+Feature` file must split responsibility, not just text.
- No `!`, `try!` or `as!`. If one is truly unavoidable (e.g. `layer as! AVCaptureVideoPreviewLayer` guaranteed by `layerClass`), add a comment saying why plus `// swiftlint:disable:this force_cast`.
- No silent `try?` on something that can fail for a reason the user or a log should know about. Either handle it or say in a comment why ignoring it is safe.
- Strong types over strings: statuses, kinds and keys are `enum`s or constants (`SettingsKey`), never repeated literals.
- Narrowest access level that compiles. Nothing is `public` in an app target; test-only hooks are not API.

## Swift style (swift-format)

Config copied from Enchat (`.swift-format`): 4-space indentation, lines up to 130 characters, at most 1 blank line, ordered and grouped imports, one variable or `case` per line, `///` for doc comments, no block comments, no semicolons, no parentheses around conditions, shorthand type names (`[T]`, `T?`), trailing commas in multi-line collections.

## Concurrency

- UI state lives in `@MainActor @Observable final class` models (`CameraService`); views own them with `@State`.
- Work that must leave the main actor sits behind a type with its own serial queue or actor (`CaptureEngine`). Mark it `@unchecked Sendable` only when every mutable member is touched on that queue, and say so in the type's doc comment.
- Bridge callbacks with `withCheckedContinuation` / `withCheckedThrowingContinuation`; resume exactly once.
- Build with zero warnings. A concurrency warning is a bug, not noise.

## SwiftUI

- Persisted settings use `@AppStorage` with keys from `SettingsKey`; defaults are named constants (`RingLight.defaultTone`).
- Pure math (zoom clamping, colour temperature, pan limits) lives in UIKit-free enums so it is unit-tested without a device.
- Visual constants: once the same radius or spacing appears in two places, introduce `Radius` / `Spacing` token enums (Enchat's `Tokens.swift`), named for the surface ("card", "panel"), not the number.
- Reuse controls (`GlassCircleButton`, `SliderRow`) instead of copying modifiers; Enchat's audit found the same glass surface copied six times.
- Every icon-only button has an `accessibilityLabel`; toggles expose `.isSelected`.
- Add a `#Preview` with sample data for any view that can render without the camera.

## Strings and localisation

- Source language is **English**; Vietnamese is translated in the String Catalogs (FE-01 D12). Enchat uses Vietnamese as the source; we deliberately do not.
- Text shown to people goes through `Text("…")`, `LocalizedStringKey` or `LocalizedStringResource`, so it is extracted into `Localizable.xcstrings`. Data (numbers, names) goes in as `Text(verbatim:)` or `"\(value)"`.
- Permission prompts live in `InfoPlist.xcstrings`; the English text in build settings must match its `en` entry.
- Every new key gets a `vi` translation in the same change.

## Comments and docs

- Comments say **why**, not what. Name the spec or the platform behaviour they rely on.
- No ticket IDs (`FE-01`, `D3`) in code comments; they age badly. Card IDs and decision numbers go in commit messages.
- Doc comments on non-obvious types and on any API with a precondition (queue, actor, ownership).
- Each app or tool folder that needs setup has a README with a "Path | What" table, how to build and test, and how to run on an iPhone.
- Architecture decisions go to `docs/adr/NNNN-title.md`.

## Tests

- Swift Testing (`import Testing`, `@Test`, `#expect`), grouped in `struct`s per subject; parameterised with `@Test(arguments:)` for tables.
- Test pure logic in the unit target; camera, brightness and haptics are checked by hand on an iPhone (the user runs manual UI tests).
- A bug fix comes with a test that fails without it, when the logic is testable.

## Tooling

| Tool | Config | Role |
| --- | --- | --- |
| swift-format (bundled with Xcode) | `.swift-format` | `xcrun swift-format lint --strict` in CI; `format --in-place` to fix |
| SwiftLint, pinned in `mise.toml` | `.swiftlint.yml` (`only_rules`: lengths, complexity, force unwrap/try/cast) | Fails CI on any new violation; old ones go in a baseline |
| Periphery, pinned in `mise.toml` | `.periphery.yml` | Dead-code report, does not fail CI |
| `ios/scripts/ci-ios.sh` | | Format, lint, tests, simulator and device builds with `CODE_SIGNING_ALLOWED=NO`. Run before committing |

mise tasks follow Enchat's names: `ios:build-sim`, `ios:sim`, `ios:device`, `ios:format`, `ios:lint`, `ios:dead-code`.

## Simulators and devices

- Reuse existing simulators; never create new devices. Reinstall on them instead.
- Build only unless asked to test; manual UI checks are done by the user.

## Signing and configuration

- Signing stays out of git: `ios/Config/Signing.xcconfig` (committed: bundle ID, empty team) includes the gitignored `ios/Config/Local.xcconfig` (`DEVELOPMENT_TEAM`, optionally a development bundle ID), copied from the committed `Local.xcconfig.example`. A free Personal Team must use a development-only bundle ID. The same team signs Debug and Release, so enMirror needs no separate `Release.local.xcconfig`.
- Per-machine device and simulator IDs go in `mise.local.toml` (gitignored), not in xcconfig.
- Ship `PrivacyInfo.xcprivacy`: no tracking, no collected data, Required Reason API `UserDefaults` CA92.1 (for `@AppStorage`).

## Git

- Conventional Commits, lower-case imperative summary saying what changes for the user: `type(scope): summary`.
  - Types: `feat`, `fix`, `refactor`, `test`, `docs`, `build`, `chore`.
  - Scopes: `ios`, `scripts`, `docs`, `landing`, … (the area touched).
  - Body: why, plus card and decision IDs (`FE-01 D7`).
- Never commit build output, `xcuserdata`, secrets or `Local.xcconfig`.
- Third-party code, fonts, sounds or artwork are listed in `THIRD_PARTY_NOTICES.md` with source and licence.

## Work tracking

Cards live on the Lanework board `mayfamily/enmirror` (see `AGENTS.md`): decisions in the card's checklist, work starts after they are ticked, verify steps ticked with evidence, finished work goes to Review.

## Where enMirror stands today

All gaps from the first audit are closed (FE-02): one main type per file, swift-format + SwiftLint + Periphery wired into `ios/scripts/ci-ios.sh` and `mise.toml`, signing in `ios/Config/Signing.xcconfig` + gitignored `Local.xcconfig`, `PrivacyInfo.xcprivacy`, `THIRD_PARTY_NOTICES.md`, `README.md`, `docs/runbook.md`, and canvas previews in `Mirror/Previews.swift`. `ios/scripts/ci-ios.sh` passes with no warnings and Periphery finds no unused code.

Watch next: `MirrorView` is again close to the 300-line type limit. The live preview, tool panel, toast and self-timer already live in their own types; the next feature should move the bottom bar (`liveBar`) and the top bar into their own views first.
