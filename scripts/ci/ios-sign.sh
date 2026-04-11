#!/usr/bin/env bash
# =============================================================================
# scripts/ci/ios-sign.sh — Phase 2 only
#
# Signs the iOS app via fastlane match and uploads to TestFlight.
# Run after secrets are exported into the environment.
#
# Required env vars (from Infisical):
#   MATCH_GIT_URL                   private git repo URL for cert/profile storage
#   MATCH_PASSWORD                  encryption password for the match repo
#   APP_STORE_CONNECT_API_KEY_PATH  path to .p8 key file
#   APP_STORE_CONNECT_KEY_ID        10-char key ID from App Store Connect
#   APP_STORE_CONNECT_ISSUER_ID     UUID issuer ID from App Store Connect
#
# Must be run on macOS (Xcode required).
# Called by: .github/workflows/capacitor-ios.yml (Phase 2)
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/config.sh"
source "$REPO_ROOT/scripts/common.sh"
source "$REPO_ROOT/scripts/ci/secrets.sh"

banner "iOS Sign + Distribute (Phase 2)"

# ── macOS guard ───────────────────────────────────────────────────────────────

if [[ "$(uname)" != "Darwin" ]]; then
  error "iOS builds require macOS. This script cannot run on $(uname)."
fi

# ── Resolve secrets ───────────────────────────────────────────────────────────

resolve_ios_secrets

# ── Sign + distribute via Fastlane ────────────────────────────────────────────

info "Running Fastlane ios sign_and_dist lane..."
cd "$REPO_ROOT"
bundle exec fastlane ios sign_and_dist

# ── Clean up ──────────────────────────────────────────────────────────────────

rm -f "$APP_STORE_CONNECT_API_KEY_PATH"
info "Cleaned up temp credential files."

ok "iOS sign + distribute complete. Check App Store Connect > TestFlight."
