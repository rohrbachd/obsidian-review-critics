# obsidian-critics Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-17

## Active Technologies

- TypeScript 5.x (strict), Node.js 22 toolchain, CSS + Obsidian API, CodeMirror 6, esbuild, ESLint toolchain, Vitest, GitHub Actions release workflow tooling (005-release-attestation-css)
- Markdown vault files and plugin settings remain canonical runtime stores; release metadata and published release assets remain canonical release-readiness artifacts (005-release-attestation-css)

- TypeScript 5.x (strict), Node.js 22 toolchain + Obsidian API, CodeMirror 6 (`@codemirror/state`, `@codemirror/view`), esbuild, ESLint (`@typescript-eslint/*`, `eslint-plugin-obsidian`), Vitest, GitHub Actions release tooling (004-obsidian-review-fix)
- Existing plugin settings store and vault markdown remain authoritative runtime stores; release metadata files (`manifest.json`, `versions.json`, `package.json`) are authoritative for compatibility declarations (004-obsidian-review-fix)

- TypeScript 5.x (strict), Node.js 22 toolchain + Obsidian API, CodeMirror 6, esbuild, ESLint (`@typescript-eslint/*`), Vitest, Obsidian community lint rules (`eslint-plugin-obsidian`) (003-obsidian-bot-remediation)
- N/A for new feature data; existing plugin settings store and vault markdown remain authoritative stores (003-obsidian-bot-remediation)

- TypeScript 5.x (strict mode), Node.js 22 toolchain + Obsidian API, CodeMirror 6 (`@codemirror/state`, `@codemirror/view`), esbuild (002-track-changes-workflow)
- Markdown note files for review source-of-record; plugin settings store for mode/theme preferences (002-track-changes-workflow)

- TypeScript 5.x (strict mode), Node.js 22 toolchain + Obsidian API, CodeMirror 6 (`@codemirror/view`, `@codemirror/state`), esbuild (002-track-changes-workflow)
- Obsidian Markdown files for review markup; plugin data store for settings/theme presets (002-track-changes-workflow)

- TypeScript 5.x (strict mode), Node.js 22 runtime for build tooling + Obsidian API, CodeMirror 6 (`@codemirror/view`, `@codemirror/state`), esbuild (001-review-workflow)

## Project Structure

```text
src/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5.x (strict mode), Node.js 22 runtime for build tooling: Follow standard conventions

## Recent Changes

- 005-release-attestation-css: Added TypeScript 5.x (strict), Node.js 22 toolchain, CSS + Obsidian API, CodeMirror 6, esbuild, ESLint toolchain, Vitest, GitHub Actions release workflow tooling

- 004-obsidian-review-fix: Added TypeScript 5.x (strict), Node.js 22 toolchain + Obsidian API, CodeMirror 6 (`@codemirror/state`, `@codemirror/view`), esbuild, ESLint (`@typescript-eslint/*`, `eslint-plugin-obsidian`), Vitest, GitHub Actions release tooling

- 003-obsidian-bot-remediation: Added TypeScript 5.x (strict), Node.js 22 toolchain + Obsidian API, CodeMirror 6, esbuild, ESLint (`@typescript-eslint/*`), Vitest, Obsidian community lint rules (`eslint-plugin-obsidian`)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
