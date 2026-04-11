#!/usr/bin/env bash
# =============================================================================
# scripts/build/capacitor-ios.sh
#
# Builds the Holy Echoes app for iOS (unsigned xcarchive).
# Flow: npm run build → cap sync ios → pod install → Fastlane ios build lane
# Phase 1: no codesigning.
# Must be run on macOS (Xcode required).
# Called by: just build-ios
#            .github/workflows/capacitor-ios.yml
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/config.sh"
source "$REPO_ROOT/scripts/common.sh"

banner "Capacitor iOS Build"

# ── macOS guard ───────────────────────────────────────────────────────────────

if [[ "$(uname)" != "Darwin" ]]; then
  error "iOS builds require macOS. This script cannot run on $(uname)."
fi

APP_DIR="$REPO_ROOT"

require_cmd "node"
require_cmd "npm"
require_cmd "xcodebuild"
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

# ── Sync into iOS project ─────────────────────────────────────────────────────

info "Running cap sync ios..."
npx cap sync ios

# ── Build via Fastlane ────────────────────────────────────────────────────────
# Fastlane's ios build lane runs cocoapods() before xcodebuild.

info "Running Fastlane ios build lane..."
bundle exec fastlane ios build

ok "iOS build complete."
info "Output: $APP_DIR/ios/App/App.xcarchive"
