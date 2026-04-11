#!/usr/bin/env bash
# =============================================================================
# scripts/build/capacitor-web.sh
#
# Builds the Holy Echoes app for web only (no native tooling needed).
# Output is the standard Vite build in dist/.
# Called by: just build-web
#            .github/workflows/capacitor-web.yml
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/config.sh"
source "$REPO_ROOT/scripts/common.sh"

banner "Capacitor Web Build"

APP_DIR="$REPO_ROOT"

require_cmd "node"
require_cmd "npm"

cd "$APP_DIR"

# ── Install npm dependencies ──────────────────────────────────────────────────

info "Installing npm dependencies..."
npm ci

# ── Build ─────────────────────────────────────────────────────────────────────

info "Running Vite build..."
npm run build

ok "Web build complete."
info "Output: $APP_DIR/dist/"
