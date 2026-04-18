# Obsidian Integration and Test Guide

This guide explains how to integrate this plugin into an Obsidian vault and validate that it works end-to-end.

## 1. Prerequisites

- Obsidian Desktop installed
- Node.js 22+
- This repository checked out locally

## 2. Build the Plugin

From the repository root, run:

```powershell
npm install
npm run check
npm run build
```

Expected build outputs in this repository root:

- `main.js`
- `manifest.json`
- `styles.css`

## 3. Install into an Obsidian Vault

Do not copy the entire repository into the vault. Copy only the built runtime files.

Target directory:

```text
<VaultPath>/.obsidian/plugins/review-critic
```

Files to copy:

- `main.js`
- `manifest.json`
- `styles.css`

PowerShell example:

```powershell
$vault = "D:\\Path\\To\\Your\\Vault"
$pluginDir = Join-Path $vault ".obsidian\\plugins\\review-critic"
New-Item -ItemType Directory -Force -Path $pluginDir | Out-Null
Copy-Item .\\main.js, .\\manifest.json, .\\styles.css -Destination $pluginDir -Force
```

### Faster Deploy for Testing

This project includes a deploy script.

Option A: Pass vault path directly.

```powershell
npm run deploy -- "D:\\Path\\To\\Your\\Vault"
```

Option B: Use environment variable.

```powershell
$env:OBSIDIAN_VAULT_PATH = "D:\\Path\\To\\Your\\Vault"
npm run deploy
```

Build + deploy in one command:

```powershell
npm run deploy:build -- "D:\\Path\\To\\Your\\Vault"
```

If `deploy:build` fails on Windows with a Node out-of-memory/runtime error, run these two steps separately:

```powershell
npm run build
npm run deploy -- "D:\\Path\\To\\Your\\Vault"
```

If Node still crashes for deploy, use direct copy fallback:

```powershell
$vault = "D:\\Path\\To\\Your\\Vault"
$pluginDir = Join-Path $vault ".obsidian\\plugins\\review-critic"
New-Item -ItemType Directory -Force -Path $pluginDir | Out-Null
Copy-Item .\\main.js, .\\manifest.json, .\\styles.css -Destination $pluginDir -Force
```

## 4. Enable Community Plugins in Obsidian

1. Open Obsidian.
2. Go to `Settings` -> `Community plugins`.
3. If needed, disable Safe mode.
4. Enable plugin: `Review & Critic`.

## 5. Smoke Test in Obsidian

Create a note and run these checks from the Command Palette (`Ctrl/Cmd+P`):

1. `Comment`
   : Inserts `{>> [author=...]  <<}` or `{>>  <<}`.
2. `Comment Selection`
   : With selected text, inserts `{==selected==}{>> ... <<}`.
3. `Add`
   : Wraps selection with `{++...++}`.
4. `Delete`
   : Wraps selection with `{--...--}`.
5. `Highlight`
   : Wraps selection with `{==...==}`.
6. `Replace`
   : Wraps selection with `{~~...~>~~}`.
7. `Comments Pane`
   : Opens the comments pane and lists comments from current note.

Then click a comment in the pane and confirm the editor cursor navigates to the matching text.

## 6. Rendering Validation

- Reading View:
  - Switch note to Reading View and confirm tokens are rendered with plugin styles.
- Live Preview:
  - Keep note in Live Preview and confirm syntax receives visual decorations while remaining editable.

## 7. Settings Persistence Validation

1. Open `Settings` -> `Review & Critic`.
2. Change `Default Author Name` and color/toggle settings.
3. Close and reopen Obsidian.
4. Confirm values persist and are applied.

## 8. Useful Dev Commands

```powershell
npm run dev
npm run lint
npm run format:check
npm run test
```

Use `npm run dev` while editing plugin code to rebuild quickly.

## 9. Troubleshooting

- Plugin does not appear in Obsidian:
  - Verify folder path is exactly `<Vault>/.obsidian/plugins/review-critic`.
  - Verify `manifest.json` and `main.js` exist in that folder.
- Plugin appears but cannot be enabled:
  - Check Obsidian developer console for errors.
  - Re-run `npm run build` and reload Obsidian.
  - If you see `Unrecognized extension value in extension set`, rebuild and redeploy so CodeMirror packages are not bundled twice.
- Plugin enables but notes do not open or render:
  - Open Obsidian developer tools:
    - `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
  - Go to `Console` and look for errors containing `review-critic`.
  - Disable this plugin and verify notes open again.
  - If notes recover, re-enable and capture the first stack trace from Console.
  - Deploy fresh build artifacts again:
    - `npm run deploy:build -- "<VaultPath>"`
  - Temporarily turn off these plugin settings to isolate:
    - `Enable Reading View Rendering`
    - `Enable Live Preview Decoration`
- Changes not reflected:
  - Run `npm run dev` or `npm run build` again.
  - In Obsidian Community plugins page, disable/enable plugin.
