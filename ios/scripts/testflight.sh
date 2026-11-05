#!/usr/bin/env bash
# Archives the Release build for TestFlight and exports it with a fresh build number (UTC
# timestamp). Without --upload it only exports an .ipa under build/testflight and prints how to
# upload; with --upload, xcodebuild sends it to App Store Connect (docs/runbook.md).
# Usage: scripts/testflight.sh [--upload]
set -euo pipefail
cd "$(dirname "$0")/.."

upload=false
[[ "${1:-}" == "--upload" ]] && upload=true

if [[ ! -f Config/Local.xcconfig ]]; then
  echo "missing Config/Local.xcconfig: copy Local.xcconfig.example and set the paid team" >&2
  exit 1
fi

settings=$(xcodebuild -project EnMirror.xcodeproj -target EnMirror -configuration Release -showBuildSettings 2>/dev/null)
setting() { awk -F' = ' -v key="$1" '$1 ~ "^ +"key"$" { print $2; exit }' <<<"$settings"; }
team=$(setting DEVELOPMENT_TEAM)
bundle=$(setting PRODUCT_BUNDLE_IDENTIFIER)
version=$(setting MARKETING_VERSION)
if [[ -z "$team" || "$bundle" != "com.trinhvaphuong.enmirror" ]]; then
  echo "Release must sign with the paid team as com.trinhvaphuong.enmirror (got team '$team', bundle '$bundle')" >&2
  exit 1
fi

build_number=$(date -u +%Y%m%d%H%M)
out=build/testflight
archive="$out/EnMirror-$build_number.xcarchive"
mkdir -p "$out"

echo "Archiving enMirror $version ($build_number) for $bundle, team $team"
xcodebuild archive \
  -project EnMirror.xcodeproj -scheme EnMirror -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$archive" \
  CURRENT_PROJECT_VERSION="$build_number" -allowProvisioningUpdates -quiet

destination=export
$upload && destination=upload
options="$out/ExportOptions.plist"
cat > "$options" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>method</key>
	<string>app-store-connect</string>
	<key>destination</key>
	<string>$destination</string>
	<key>teamID</key>
	<string>$team</string>
	<key>signingStyle</key>
	<string>automatic</string>
	<key>manageAppVersionAndBuildNumber</key>
	<false/>
</dict>
</plist>
PLIST

xcodebuild -exportArchive -archivePath "$archive" -exportOptionsPlist "$options" \
  -exportPath "$out/export-$build_number" -allowProvisioningUpdates -quiet

if $upload; then
  echo "Uploaded build $build_number. It appears in App Store Connect › TestFlight after processing (about 10–30 minutes)."
else
  echo "Exported $out/export-$build_number/EnMirror.ipa (build $build_number). Nothing was uploaded."
  echo "To upload: mise run testflight:upload   (or drag the .ipa into Transporter)"
fi
