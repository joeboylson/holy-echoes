#!/usr/bin/env bash
# =============================================================================
# scripts/ci/android-sign.sh — Phase 2 only
#
# Signs the Android AAB and uploads to Google Play internal track via Fastlane.
# Run after infisical-auth.sh has exported secrets into the environment.
#
# Required env vars (from Infisical):
#   KEYSTORE_FILE         base64-encoded .jks keystore
#   KEYSTORE_PASSWORD     keystore store password
#   KEY_ALIAS             signing key alias within the keystore
#   KEY_PASSWORD          signing key password
#   GOOGLE_PLAY_JSON_KEY  Google service account JSON (for Play API auth)
#
# Called by: .github/workflows/capacitor-android.yml (Phase 2)
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/config.sh"
source "$REPO_ROOT/scripts/common.sh"
source "$REPO_ROOT/scripts/ci/secrets.sh"

banner "Android Sign + Distribute (Phase 2)"

# ── Resolve secrets ───────────────────────────────────────────────────────────

resolve_android_secrets

# Write Google Play JSON key to a temp file (Fastlane reads it from a path)
GOOGLE_PLAY_JSON_KEY_PATH="/tmp/google-play-key.json"
echo "$GOOGLE_PLAY_JSON_KEY" > "$GOOGLE_PLAY_JSON_KEY_PATH"
export GOOGLE_PLAY_JSON_KEY_PATH

# ── Sign + distribute via Fastlane ────────────────────────────────────────────

info "Running Fastlane android sign_and_dist lane..."
cd "$REPO_ROOT"
bundle exec fastlane android sign_and_dist

# ── Clean up temp files ───────────────────────────────────────────────────────

rm -f "$GOOGLE_PLAY_JSON_KEY_PATH"
info "Cleaned up temp credential files."

ok "Android sign + distribute complete. Check Google Play Console internal track."
