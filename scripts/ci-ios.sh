#!/usr/bin/env bash
# Every check of the app. Run it before committing. Needs Xcode (checked with 27.0) and mise.
set -euo pipefail
cd "$(dirname "$0")/.."
# SIMULATOR overrides the destination; else ENMIRROR_SIM (mise.local.toml), else the first
# available iOS simulator, whatever its name.
first_sim=$(xcrun simctl list devices available | sed -nE 's/.*\(([0-9A-F-]{36})\) \(.*/\1/p' | head -1)
sim_id=${ENMIRROR_SIM:-${first_sim:?no iOS simulator available}}
simulator=${SIMULATOR:-"platform=iOS Simulator,id=$sim_id"}

# Conventions (docs/conventions.md): swift-format, then SwiftLint.
scripts/ios-swift-files.sh | xargs -0 xcrun swift-format lint --strict --parallel
mise exec -- swiftlint lint --quiet --strict

xcodebuild test -quiet -project EnMirror.xcodeproj -scheme EnMirror -destination "$simulator" \
  -derivedDataPath build/ci-ios/test CODE_SIGNING_ALLOWED=NO

for destination in "generic/platform=iOS Simulator" "generic/platform=iOS"; do
  xcodebuild build -quiet -project EnMirror.xcodeproj -scheme EnMirror -destination "$destination" \
    -derivedDataPath "build/ci-ios/${destination##*=}" CODE_SIGNING_ALLOWED=NO
done
# Dead code, from the simulator build's index; a report only (.periphery.yml).
mise exec -- periphery scan --quiet --relative-results \
  --index-store-path "build/ci-ios/iOS Simulator/Index.noindex/DataStore" || true
