#!/usr/bin/env bash
# Every check of the landing site (web/apps/landing). Run it before committing web changes.
# Needs Bun. Builds in release mode, so a leftover placeholder fails here, not at deploy time.
set -euo pipefail
cd "$(dirname "$0")/.."

bun install --frozen-lockfile
bun run typecheck
(cd apps/landing && ENMIRROR_RELEASE=1 bun run build)
# The URLs the iOS app (AppLinks.swift) and App Store Connect point at must exist.
for page in index privacy support terms en en/privacy en/support en/terms 404; do
  test -f "apps/landing/dist/$page.html" || { echo "missing dist/$page.html" >&2; exit 1; }
done
(cd apps/landing && bunx wrangler deploy --dry-run --outdir "$(mktemp -d)" >/dev/null)
echo "web: ok"
