# obsidian-critics Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-17

## Active Technologies

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

- 003-obsidian-bot-remediation: Added TypeScript 5.x (strict), Node.js 22 toolchain + Obsidian API, CodeMirror 6, esbuild, ESLint (`@typescript-eslint/*`), Vitest, Obsidian community lint rules (`eslint-plugin-obsidian`)

- 002-track-changes-workflow: Added TypeScript 5.x (strict mode), Node.js 22 toolchain + Obsidian API, CodeMirror 6 (`@codemirror/state`, `@codemirror/view`), esbuild

- 002-track-changes-workflow: Added TypeScript 5.x (strict mode), Node.js 22 toolchain + Obsidian API, CodeMirror 6 (`@codemirror/view`, `@codemirror/state`), esbuild

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
