#!/usr/bin/env bash
# Takes the raw App Store screenshots on the simulator, in English and Vietnamese. A Debug build
# shows the demo photo in place of the camera (StoreDemo, -storeDemo) and sets each scene up
# (-storeScene). Output: ios/StoreScreenshots/raw/<lang>/<NN-scene>.png; then run
# ios/scripts/store-screenshots.py and store-creative.py (or mise run ios:store).
set -euo pipefail
cd "$(dirname "$0")/.."

sim=${ENMIRROR_SIM:?set ENMIRROR_SIM in mise.local.toml}
bundle=com.trinhvaphuong.enmirror
photo=../web/apps/landing/public/mirror/reflection.webp
scenes=(01:light 02:zoom 03:freeze 04:delay 05:guide 06:pin)

xcodebuild build -quiet -project EnMirror.xcodeproj -scheme EnMirror -configuration Debug \
  -destination "id=$sim" -derivedDataPath build/store CODE_SIGNING_ALLOWED=NO
app=build/store/Build/Products/Debug-iphonesimulator/EnMirror.app

xcrun simctl boot "$sim" 2>/dev/null || true
xcrun simctl bootstatus "$sim" >/dev/null
xcrun simctl uninstall "$sim" "$bundle" 2>/dev/null || true
xcrun simctl install "$sim" "$app"
# The app reads the photo from its own container, the one place a simulator app can always read.
container=$(xcrun simctl get_app_container "$sim" "$bundle" data)
sips -s format png "$photo" --out "$container/tmp/store-demo.png" >/dev/null
xcrun simctl status_bar "$sim" override --time 9:41 --batteryState charged --batteryLevel 100
# The first launch after an install is slow; open it once so every scene gets the same timing.
xcrun simctl launch "$sim" "$bundle" -storeDemo "$container/tmp/store-demo.png" >/dev/null
sleep 5

for lang in en vi; do
  out=StoreScreenshots/raw/$lang
  mkdir -p "$out"
  for entry in "${scenes[@]}"; do
    number=${entry%%:*} scene=${entry#*:}
    xcrun simctl terminate "$sim" "$bundle" 2>/dev/null || true
    xcrun simctl launch "$sim" "$bundle" -storeDemo "$container/tmp/store-demo.png" -storeScene "$scene" \
      -AppleLanguages "($lang)" -AppleLocale "$lang" >/dev/null
    sleep 5
    xcrun simctl io "$sim" screenshot "$out/$number-$scene.png" >/dev/null 2>&1
    echo "wrote $out/$number-$scene.png"
  done
done
xcrun simctl terminate "$sim" "$bundle" 2>/dev/null || true
xcrun simctl status_bar "$sim" clear
