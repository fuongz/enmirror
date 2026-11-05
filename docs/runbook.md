# Runbook

## TestFlight

### One-time setup

1. **Apple Developer Program.** The team `GWG64UPCV5` (Phuong Phung, Individual) is paid, which TestFlight requires. Check it is active at developer.apple.com › Account › Membership details.
2. **Xcode account.** Xcode › Settings › Accounts: sign in (or sign out and in again) with the Apple ID of that team. `xcodebuild -allowProvisioningUpdates` uses this login to create the certificates and profiles; "missing Xcode-Token" in the build log means the login has expired.
3. **Bundle ID.** developer.apple.com › Certificates, IDs & Profiles › Identifiers › `+` › App IDs › App: description `enMirror`, explicit Bundle ID `com.trinhvaphuong.enmirror`. No extra capabilities: camera and Photos need only the Info.plist prompts. (Xcode's automatic signing also registers it on the first device build; check it is there.)
4. **App record.** appstoreconnect.apple.com › Apps › `+` › New App: platform iOS, name `enMirror` (it must be unique on the App Store; pick another if taken, the home-screen name stays `enMirror`), primary language English (U.S.), bundle ID `com.trinhvaphuong.enmirror`, SKU `enMirror` (Apple ID 6830683755), full access.
5. **Signing on this Mac.** `ios/Config/Local.xcconfig` (gitignored) holds `DEVELOPMENT_TEAM = GWG64UPCV5`. The Apple Distribution certificate is created by the first archive with `-allowProvisioningUpdates`; nothing to make by hand.

### Each build

```sh
mise run testflight:build    # archive + export an .ipa under build/testflight, no upload
mise run testflight:upload   # archive + upload to App Store Connect
```

`ios/scripts/testflight.sh` refuses to run unless Release signs with a team as `com.trinhvaphuong.enmirror`, and stamps the build number with the UTC time (`CURRENT_PROJECT_VERSION`), so every upload is unique. Bump `MARKETING_VERSION` (1.0 → 1.1) in the project for a new version.

Export compliance: `ITSAppUsesNonExemptEncryption = NO` is in Info.plist (the app uses no encryption), so App Store Connect does not ask on each build.

### After the upload

1. The build shows in App Store Connect › the app › TestFlight after processing (10–30 minutes, with an e-mail).
2. **Internal testing** (you and up to 100 people with roles in App Store Connect): TestFlight › Internal Testing › `+` group › add testers › add the build. No review needed; testers install from the TestFlight app.
3. **External testing** (anyone by e-mail or public link): the first build of each version goes through Beta App Review (usually under a day). It needs Test Information: a beta description, a feedback e-mail and, for the review, a note that the app only needs the front camera and has no login.

### Before the App Store (later)

App Privacy in App Store Connect: "Data Not Collected" (matches `PrivacyInfo.xcprivacy`). Age rating 4+. Privacy policy URL: required even with no data collected. Screenshots for 6.9" (and 6.5") iPhones.
