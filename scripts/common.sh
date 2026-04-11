#!/usr/bin/env bash
# =============================================================================
# scripts/common.sh — shared utilities sourced by every script
#
# Usage (at the top of any script):
#   REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
#   source "$REPO_ROOT/scripts/common.sh"
# =============================================================================

# Exit immediately on error, treat unset variables as errors, fail on pipe errors
set -euo pipefail

# ── Logging ───────────────────────────────────────────────────────────────────

log()   { echo "[$(date '+%H:%M:%S')] $*"; }
info()  { echo "[$(date '+%H:%M:%S')] INFO  $*"; }
ok()    { echo "[$(date '+%H:%M:%S')] OK    $*"; }
warn()  { echo "[$(date '+%H:%M:%S')] WARN  $*" >&2; }
error() { echo "[$(date '+%H:%M:%S')] ERROR $*" >&2; exit 1; }

# ── Environment validation ────────────────────────────────────────────────────

# Fail fast with a clear message if a required env var is missing or empty
require_env() {
  local var_name="$1"
  if [[ -z "${!var_name:-}" ]]; then
    error "Required environment variable \$$var_name is not set. Check config.sh or your secrets source."
  fi
}

# ── Command checks ────────────────────────────────────────────────────────────

# Fail fast if a required CLI tool is not installed
require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" &>/dev/null; then
    error "Required command '$cmd' not found. Check your setup scripts or tool versions."
  fi
}

# ── Banner ────────────────────────────────────────────────────────────────────

banner() {
  local title="$1"
  echo ""
  echo "════════════════════════════════════════"
  echo "  $title"
  echo "════════════════════════════════════════"
  echo ""
}
