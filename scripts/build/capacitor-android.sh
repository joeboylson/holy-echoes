#!/usr/bin/env bash
# =============================================================================
# scripts/build/capacitor-android.sh
#
# Builds the Holy Echoes app for Android (release AAB).
# Flow: npm run build → cap sync android → Fastlane android build lane
# Phase 1: debug signing, no secrets needed.
# Called by: just build-android
#            .github/workflows/capacitor-android.yml
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/config.sh"
source "$REPO_ROOT/scripts/common.sh"

banner "Capacitor Android Build"

APP_DIR="$REPO_ROOT"

require_cmd "node"
require_cmd "npm"
require_cmd "bundle"

cd "$APP_DIR"

# ── Install Ruby gems ─────────────────────────────────────────────────────────

info "Installing Ruby gems (Fastlane)..."
bundle config set --local path vendor/bundle
bundle install --quiet

# ── Install npm dependencies ──────────────────────────────────────────────────

info "Installing npm dependencies..."
npm ci

# ── Build web assets ──────────────────────────────────────────────────────────

info "Running Vite build..."
npm run build

# ── Sync into Android project ─────────────────────────────────────────────────

info "Running cap sync android..."
npx cap sync android

# ── Generate debug keystore if missing ───────────────────────────────────────

KEYSTORE_PATH="$HOME/.android/debug.keystore"
if [ ! -f "$KEYSTORE_PATH" ]; then
  info "Generating debug keystore..."
  mkdir -p "$HOME/.android"
  keytool -genkeypair -v \
    -keystore "$KEYSTORE_PATH" \
    -alias androiddebugkey \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass android -keypass android \
    -dname "CN=Android Debug,O=Android,C=US" \
    2>/dev/null
fi

# ── Build via Fastlane ────────────────────────────────────────────────────────

info "Running Fastlane android build lane..."
bundle exec fastlane android build

ok "Android build complete."
info "Output: $APP_DIR/android/app/build/outputs/bundle/release/app-release.aab"
