# =============================================================================
# justfile — unified entry point for all project commands
# https://github.com/casey/just
#
# Install just: brew install just (macOS) | cargo install just (any)
# Run `just` with no args to list all available commands.
# =============================================================================

# Default: list all recipes
default:
    @just --list

# ── Docker ────────────────────────────────────────────────────────────────────

# Build the custom Android Docker image locally (used by act for CI simulation)
docker-build:
    docker build \
        --file docker/android.Dockerfile \
        --tag holy-echoes-android:latest \
        .

# ── Builds ───────────────────────────────────────────────────────────────────

# Build for Android (npm build → cap sync → Gradle AAB)
build-android:
    bash scripts/build/capacitor-android.sh

# Build for iOS (npm build → cap sync → xcodebuild)
build-ios:
    bash scripts/build/capacitor-ios.sh

# Build for web (npm build → dist/)
build-web:
    bash scripts/build/capacitor-web.sh

# Build all targets
build-all: build-android build-ios build-web

# ── Local CI simulation (requires act + Docker) ───────────────────────────────

# Simulate the Android CI workflow locally
act-android:
    act push -W .github/workflows/capacitor-android.yml

# Simulate the iOS CI workflow locally (macOS only — Docker not supported)
act-ios:
    act push -W .github/workflows/capacitor-ios.yml

# Simulate the web CI workflow locally
act-web:
    act push -W .github/workflows/capacitor-web.yml
