#!/usr/bin/env bash
# The hand-written Swift of the app, NUL-separated, for swift-format.
set -euo pipefail
cd "$(dirname "$0")/.."
find EnMirror EnMirrorTests scripts -name '*.swift' -print0
