#!/usr/bin/env bash
# =============================================================================
# scripts/ci/secrets.sh — Phase 2 secret resolution layer
#
# This file is the single place where secrets are fetched and exported.
# Each secret has its own function. To change how a secret is retrieved,
# edit only the body of that function — nothing else in the pipeline changes.
#
# Supported provider patterns (pick one per secret, shown in comments):
#
#   ENV VAR        echo "${ENV_VAR_NAME}"
#   INFISICAL CLI  infisical secret get SECRET_NAME --env production --plain
#   FILE           cat "$SECRETS_DIR/secret_name.txt"
#
# Usage in signing scripts:
#   source "$REPO_ROOT/scripts/ci/secrets.sh"
#   resolve_android_secrets    # exports KEYSTORE_PATH, KEYSTORE_PASSWORD, etc.
#   resolve_ios_secrets        # exports APPLE_ID, MATCH_PASSWORD, etc.
# =============================================================================

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/scripts/common.sh"

# ── Individual secret resolvers ───────────────────────────────────────────────

_secret_keystore_path() {
  # Infisical (base64-encoded keystore, decoded to disk):
  #   local b64; b64=$(infisical secret get KEYSTORE_B64 --env production --plain)
  #   echo "$b64" | base64 -d > /tmp/release.jks
  #   echo "/tmp/release.jks"
  echo "${KEYSTORE_PATH}"
}

_secret_keystore_password() {
  echo "${KEYSTORE_PASSWORD}"
}

_secret_key_alias() {
  echo "${KEY_ALIAS}"
}

_secret_key_password() {
  echo "${KEY_PASSWORD}"
}

_secret_google_play_json_key() {
  echo "${GOOGLE_PLAY_JSON_KEY}"
}

_secret_apple_id() {
  echo "${APPLE_ID}"
}

_secret_team_id() {
  echo "${TEAM_ID}"
}

_secret_app_store_connect_api_key_path() {
  # Infisical (base64-encoded .p8):
  #   local b64; b64=$(infisical secret get ASC_KEY_B64 --env production --plain)
  #   echo "$b64" | base64 -d > /tmp/asc_key.p8
  #   echo "/tmp/asc_key.p8"
  echo "${APP_STORE_CONNECT_API_KEY_PATH}"
}

_secret_app_store_connect_key_id() {
  echo "${APP_STORE_CONNECT_KEY_ID}"
}

_secret_app_store_connect_issuer_id() {
  echo "${APP_STORE_CONNECT_ISSUER_ID}"
}

_secret_match_git_url() {
  echo "${MATCH_GIT_URL}"
}

_secret_match_password() {
  echo "${MATCH_PASSWORD}"
}

# ── Resolve groups ────────────────────────────────────────────────────────────

resolve_android_secrets() {
  info "Resolving Android signing secrets..."

  export KEYSTORE_PATH="$(_secret_keystore_path)"
  export KEYSTORE_PASSWORD="$(_secret_keystore_password)"
  export KEY_ALIAS="$(_secret_key_alias)"
  export KEY_PASSWORD="$(_secret_key_password)"
  export GOOGLE_PLAY_JSON_KEY="$(_secret_google_play_json_key)"

  require_env "KEYSTORE_PATH"
  require_env "KEYSTORE_PASSWORD"
  require_env "KEY_ALIAS"
  require_env "KEY_PASSWORD"
  require_env "GOOGLE_PLAY_JSON_KEY"

  ok "Android secrets resolved."
}

resolve_ios_secrets() {
  info "Resolving iOS signing secrets..."

  export APPLE_ID="$(_secret_apple_id)"
  export TEAM_ID="$(_secret_team_id)"
  export APP_STORE_CONNECT_API_KEY_PATH="$(_secret_app_store_connect_api_key_path)"
  export APP_STORE_CONNECT_KEY_ID="$(_secret_app_store_connect_key_id)"
  export APP_STORE_CONNECT_ISSUER_ID="$(_secret_app_store_connect_issuer_id)"
  export MATCH_GIT_URL="$(_secret_match_git_url)"
  export MATCH_PASSWORD="$(_secret_match_password)"

  require_env "APPLE_ID"
  require_env "TEAM_ID"
  require_env "APP_STORE_CONNECT_API_KEY_PATH"
  require_env "MATCH_GIT_URL"
  require_env "MATCH_PASSWORD"

  ok "iOS secrets resolved."
}
