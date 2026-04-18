# Release Workflow (Repeatable)

This is the exact process to publish each new plugin release.

```powershell
.\scripts\release.ps1 -Type patch
```

or

```powershell
npm run release:auto -- patch
```

Supported types:

patch (0.1.1 -> 0.1.2)
minor (0.1.1 -> 0.2.0)
major (1.1.4 -> 2.0.0)

## One-time Setup

### 1. Install GitHub CLI (`gh`)

Windows (recommended):

```powershell
winget install --id GitHub.cli
```

Alternative (Chocolatey):

```powershell
choco install gh
```

macOS:

```bash
brew install gh
```

Linux:

Use the official instructions: `https://github.com/cli/cli#installation`

### 2. Authenticate once

```powershell
gh auth login
```

Choose `GitHub.com`, then `HTTPS`, then follow browser login.

### 3. Verify setup

```powershell
gh --version
gh auth status
```

## Every Time You Want a New Release

Assume your feature/fix commits are already pushed to `main`.

### 1. Run a single release command

PowerShell:

```powershell
.\scripts\release.ps1 -Type patch
```

or with npm:

```powershell
npm run release:auto -- patch
```

Release types:

- `patch`: `0.1.1 -> 0.1.2`
- `minor`: `0.1.1 -> 0.2.0`
- `major`: `1.1.4 -> 2.0.0`

### 2. What this single command does

1. Verifies you are on `main`
2. Verifies clean working tree
3. Reads latest **published GitHub release** and compares with local `manifest.json`
4. Uses the higher version as release base (prevents downgrade on retries)
5. Bumps version in `manifest.json` and `package.json`
6. Updates `versions.json` for the new version
7. Commits release bump (`release: <newVersion>`)
8. Builds plugin artifacts
9. Runs release validation checks
10. Pushes `main` to `origin`
11. Creates and pushes git tag `<newVersion>` (no `v`)
12. Creates GitHub release `<newVersion>`
13. Uploads `manifest.json`, `main.js`, `styles.css`

### 3. Verify on GitHub

Open:

`https://github.com/rohrbachd/obsidian-review-critics/releases`

Check that the new release contains:

- `manifest.json`
- `main.js`
- `styles.css`

## Common Errors

- `tag already exists`: bump version in `manifest.json` and `versions.json` and retry.
- `working tree is not clean`: commit/stash changes first.
- `gh auth` failure: run `gh auth login` again.
- version mismatch error: ensure release version equals `manifest.json` version exactly.
- `not on main`: checkout `main` and pull latest before running release.
- publish failed before release creation: rerun the same command. The script uses the higher of latest published release and local manifest, so retries do not downgrade or keep incrementing unexpectedly.
