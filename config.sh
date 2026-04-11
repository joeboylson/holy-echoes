#!/usr/bin/env bash
# =============================================================================
# config.sh — single source of truth for all project configuration
#
# Source this at the top of every script:
#   REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
#   source "$REPO_ROOT/config.sh"
#
# Fastlane reads these as environment variables automatically.
# Workflow YAML files source this before calling any script.
# =============================================================================

# ── App ───────────────────────────────────────────────────────────────────────

export APP_ID="com.holyechoes.app"
export APP_NAME="Holy Echoes"
export CAPACITOR_APP_DIR="."

# ── Tool Versions ─────────────────────────────────────────────────────────────
# Keep these in sync with .tool-versions and docker/android.Dockerfile

export NODE_VERSION="22.15.0"
export RUBY_VERSION="3.3.0"
export JAVA_VERSION="21"

# ── Android ───────────────────────────────────────────────────────────────────

export ANDROID_COMPILE_SDK="35"
export ANDROID_MIN_SDK="23"
export ANDROID_TARGET_SDK="35"
export ANDROID_BUILD_TOOLS="35.0.0"

# Version string of the Android cmdline-tools zip from dl.google.com
# Update this when upgrading the Android SDK toolchain
export ANDROID_CMDLINE_TOOLS_VERSION="11076708"

# ── Paths ─────────────────────────────────────────────────────────────────────

export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"

# ── Docker ────────────────────────────────────────────────────────────────────

# Local image tag used by act and local docker builds
export DOCKER_ANDROID_IMAGE="holy-echoes-android:latest"

# GHCR image used by GitHub Actions (owner resolved at runtime via $GITHUB_REPOSITORY_OWNER)
# Referenced in workflow files as: ghcr.io/${{ github.repository_owner }}/holy-echoes-android:latest
export DOCKER_ANDROID_IMAGE_NAME="holy-echoes-android"
