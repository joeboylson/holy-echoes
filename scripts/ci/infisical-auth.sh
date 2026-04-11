#!/usr/bin/env bash
# =============================================================================
# scripts/ci/infisical-auth.sh — Phase 2 only
#
# Authenticates to Infisical and exports all project secrets as environment
# variables for the remainder of the CI job.
#
# In GitHub Actions, use the Infisical/secrets-action instead of this script
# for cleaner integration. This script is provided for local Phase 2 testing.
#
# Prerequisites:
#   - INFISICAL_TOKEN set in GitHub secrets (the only secret stored in GitHub)
#   - Infisical instance running and publicly reachable
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/config.sh"
source "$REPO_ROOT/scripts/common.sh"

banner "Infisical Authentication (Phase 2)"

require_env "INFISICAL_TOKEN"
require_env "INFISICAL_PROJECT_ID"

INFISICAL_URL="${INFISICAL_URL:-https://app.infisical.com}"
info "Infisical URL: $INFISICAL_URL"

if ! command -v infisical &>/dev/null; then
  error "Infisical CLI not found. Install: https://infisical.com/docs/cli/overview"
fi

info "Exporting secrets from Infisical (environment: production)..."
eval "$(infisical export \
  --token "$INFISICAL_TOKEN" \
  --projectId "$INFISICAL_PROJECT_ID" \
  --env production \
  --format dotenv \
  --domain "$INFISICAL_URL")"

ok "Secrets exported. Available for remainder of this session."
