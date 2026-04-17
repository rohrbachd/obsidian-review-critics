# Review & Critic

Obsidian plugin for inline review comments and CriticMarkup-style editing workflows.

## Product Requirements

- PRD: [docs/obsidian-review-plugin-prd.md](docs/obsidian-review-plugin-prd.md)
- Obsidian Integration/Test Guide: [docs/obsidian-integration-testing.md](docs/obsidian-integration-testing.md)
- Feature Activation/Usage Guide: [docs/obsidian-feature-usage.md](docs/obsidian-feature-usage.md)

## Current Scope (v1 draft implementation)

- Standalone comments and anchored comments on highlighted text
- Manual commands for addition, deletion, and substitution markup
- Reading view rendering for supported review tokens
- Live Preview decoration for supported review tokens
- Comments pane for the active note with click-to-navigate
- Persisted settings for author, rendering toggles, and color preferences

## Commands

- `Comment`
- `Comment Selection`
- `Add`
- `Delete`
- `Highlight`
- `Replace`
- `Comments Pane`

## Development

```powershell
npm install
npm run build
npm run dev
npm run deploy -- "D:\\Path\\To\\Your\\Vault"
```

Compiled plugin files are written into this folder:

- `main.js`
- `manifest.json`
- `styles.css`

If this project is under:

`<Vault>/.obsidian/plugins/obsidian-review-comments`

Obsidian can load it directly as a community plugin during development.
