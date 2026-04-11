# =============================================================================
# docker/android.Dockerfile — custom Android + Node + Ruby build image
#
# We own this image. All dependency versions are pinned here and kept in sync
# with config.sh and .tool-versions. No surprise changes from third-party images.
#
# Build locally:   just docker-build
# Push to GHCR:    handled by .github/workflows/docker-build.yml
# =============================================================================

FROM ubuntu:22.04

# Avoid interactive prompts during apt installs
ENV DEBIAN_FRONTEND=noninteractive

# ── Build args (pinned — keep in sync with config.sh and .tool-versions) ──────

ARG NODE_VERSION=22
ARG RUBY_VERSION=3.3.0
ARG JAVA_VERSION=21
ARG ANDROID_COMPILE_SDK=35
ARG ANDROID_BUILD_TOOLS=35.0.0
ARG ANDROID_CMDLINE_TOOLS_VERSION=11076708

# ── Base dependencies ─────────────────────────────────────────────────────────

RUN apt-get update && apt-get install -y \
    bash \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    wget \
    libstdc++6 \
    openjdk-${JAVA_VERSION}-jdk \
    ruby-full \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ── Node.js ───────────────────────────────────────────────────────────────────

RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# ── Ruby / Bundler / Fastlane ─────────────────────────────────────────────────

RUN gem install bundler --no-document

# ── Android SDK ───────────────────────────────────────────────────────────────

ENV ANDROID_HOME=/opt/android-sdk
ENV PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"

RUN mkdir -p $ANDROID_HOME/cmdline-tools \
    && wget -q \
        "https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_CMDLINE_TOOLS_VERSION}_latest.zip" \
        -O /tmp/cmdline-tools.zip \
    && unzip -q /tmp/cmdline-tools.zip -d $ANDROID_HOME/cmdline-tools \
    && mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest \
    && rm /tmp/cmdline-tools.zip

# Accept all SDK licenses non-interactively, then install the required platform
# and build-tools versions (pinned via build args)
RUN yes | sdkmanager --licenses > /dev/null \
    && sdkmanager \
        "platforms;android-${ANDROID_COMPILE_SDK}" \
        "build-tools;${ANDROID_BUILD_TOOLS}" \
        "platform-tools"

# ── Debug keystore ────────────────────────────────────────────────────────────
# Generate the standard Android debug keystore so Phase 1 Fastlane builds
# (which sign with the debug key) don't fail on a fresh container.
RUN mkdir -p /root/.android \
    && keytool -genkey -v \
        -keystore /root/.android/debug.keystore \
        -alias androiddebugkey \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -storepass android -keypass android \
        -dname "CN=Android Debug,O=Android,C=US" \
        > /dev/null 2>&1

# ── Verify key tools are reachable ───────────────────────────────────────────

RUN node --version \
    && npm --version \
    && ruby --version \
    && bundler --version \
    && java -version \
    && sdkmanager --version
