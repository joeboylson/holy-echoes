# Phase 2: CI Distribution
# Pushing builds to Google Play and the App Store

## Status

| Platform | Status | Notes |
|----------|--------|-------|
| Android | **Complete** | Signs AAB and uploads to Google Play internal track on every push |
| iOS | **Pending** | Compile verified; TestFlight upload not yet wired up |

---

## Architecture

All secrets live in a **self-hosted Infisical instance** at
`https://joeboylson-infisical.up.railway.app`. GitHub only holds two secrets:
`INFISICAL_CLIENT_ID` and `INFISICAL_CLIENT_SECRET` (machine identity creds).

The Infisical action used is `Infisical/secrets-action@v1.0.15`. The `domain`
parameter must be set to the self-hosted URL — `site-url` is not a valid param.
The environment slug is `prod` (not `production`).

---

## Android → Google Play (Complete)

### What's wired up

Every push to `main`, `develop`, or `feature/github-actions-ci`:
1. Pulls secrets from Infisical (`prod` environment)
2. Decodes `KEYSTORE_BASE64` → `/tmp/holy-echoes-release.keystore`
3. Runs `fastlane android sign_and_dist` — signs the AAB and uploads to the
   Google Play internal track
4. Uploads the signed AAB as a GitHub Actions artifact

### Secrets in Infisical (`prod`)

| Key | Description |
|-----|-------------|
| `KEYSTORE_BASE64` | base64-encoded `~/.android/holy-echoes-release.keystore` |
| `KEYSTORE_PASSWORD` | keystore password |
| `KEY_ALIAS` | `holy-echoes` |
| `KEY_PASSWORD` | key password |
| `GOOGLE_PLAY_JSON_KEY` | Google Play service account JSON (retrieved from Codemagic SSH) |

### Key files

- `.github/workflows/capacitor-android.yml` — CI workflow
- `fastlane/Fastfile` → `platform :android` → `lane :sign_and_dist`
- Keystore file: `~/.android/holy-echoes-release.keystore` (local only, never in repo)
- Base64 encoded: `~/.android/holy-echoes-release.keystore.b64`

### Versioning

- `versionName` is read from `VERSION.txt` at build time
- `versionCode` is generated from the current date: `Time.now.strftime("%y%j%H%M")`
- To bump the version before a release:
  ```bash
  python3 scripts/pre-commit.py --minor   # 1.0.x → 1.1.0
  python3 scripts/pre-commit.py --major   # 1.x.x → 2.0.0
  python3 scripts/pre-commit.py --patch   # default, 1.0.x → 1.0.x+1
  ```

### Getting the build on your phone

1. Play Console → Internal testing → confirm release is **Active**
2. Testers tab → copy the opt-in link → open on phone in Chrome → accept invite
3. Play Store → Profile → Manage apps & device → check for updates

---

## iOS → TestFlight (Pending)

### One-time setup required

1. **Apple Developer Program** — must be enrolled ($99/yr)

2. **App Store Connect API key:**
   - App Store Connect → Users & Access → Keys
   - Create key with "App Manager" role
   - Download the `.p8` file

3. **Set up `fastlane match`** — manages certs and provisioning profiles in a
   private Git repo:
   ```bash
   bundle exec fastlane match init
   # Choose: git
   # Enter a private repo URL (e.g. git@github.com:joeboylson/holy-echoes-certs.git)

   bundle exec fastlane match appstore
   # Generates App Store distribution cert + provisioning profile
   ```

4. **Add secrets to Infisical** (`prod` environment):

   | Key | Value |
   |-----|-------|
   | `MATCH_GIT_BASIC_AUTHORIZATION` | base64 of `user:token` for certs repo |
   | `MATCH_PASSWORD` | passphrase set during `match init` |
   | `APP_STORE_CONNECT_API_KEY_ID` | key ID from App Store Connect |
   | `APP_STORE_CONNECT_API_ISSUER_ID` | issuer ID from App Store Connect |
   | `APP_STORE_CONNECT_API_KEY_CONTENT` | contents of the `.p8` file |

5. **Add `INFISICAL_CLIENT_ID` and `INFISICAL_CLIENT_SECRET`** to GitHub Secrets
   (same machine identity as Android — already done)

### Workflow changes needed

In `.github/workflows/capacitor-ios.yml`, add after the Build step:

```yaml
- name: Pull secrets from Infisical
  uses: Infisical/secrets-action@v1.0.15
  with:
    client-id: ${{ secrets.INFISICAL_CLIENT_ID }}
    client-secret: ${{ secrets.INFISICAL_CLIENT_SECRET }}
    project-slug: holy-echoes
    env-slug: prod
    domain: https://joeboylson-infisical.up.railway.app

- name: Write App Store Connect API key
  run: |
    echo '{"key_id":"${{ env.APP_STORE_CONNECT_API_KEY_ID }}","issuer_id":"${{ env.APP_STORE_CONNECT_API_ISSUER_ID }}","key":"${{ env.APP_STORE_CONNECT_API_KEY_CONTENT }}"}' \
      > /tmp/asc-api-key.json
    echo "APP_STORE_CONNECT_API_KEY_PATH=/tmp/asc-api-key.json" >> $GITHUB_ENV

- name: Sign and distribute
  run: bundle exec fastlane ios sign_and_dist

- name: Upload artifact
  uses: actions/upload-artifact@v4
  with:
    name: holy-echoes-ios-archive
    path: ios/App/App.xcarchive
    retention-days: 7
```

### Fastfile lane (already written)

`fastlane/Fastfile` → `platform :ios` → `lane :sign_and_dist` — runs
`match(type: "appstore")`, builds a signed archive, uploads to TestFlight.

---

## Lessons learned

- Infisical action param is `domain`, not `site-url`
- Infisical action version must be pinned (e.g. `@v1.0.15`) — `@v1` does not resolve
- Infisical environment slug is `prod`, not `production`
- `xcodebuild archive` enforces signing even with `CODE_SIGNING_ALLOWED=NO` — use
  `xcodebuild build` with a simulator destination for Phase 1 compile checks
- `macos-latest` picked up Xcode 26 beta — pin to `xcode-version: '16'`
- Fastlane runs from the `fastlane/` directory — use `../VERSION.txt` to reference
  files in the repo root
- The Android Docker image and Android CI workflow run in parallel on first push —
  the image must exist before the Android job runs (race condition on initial setup)
- Docker container `HOME` is `/github/home` — generate the debug keystore there if
  it doesn't exist before running Gradle
