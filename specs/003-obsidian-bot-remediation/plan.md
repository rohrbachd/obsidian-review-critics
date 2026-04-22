# Implementation Plan: Obsidian Bot Remediation

**Branch**: `003-obsidian-bot-remediation` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-obsidian-bot-remediation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Resolve all required ObsidianReviewBot findings for the plugin submission by aligning view lifecycle signatures, promise handling, settings heading patterns, and reading-view styling patterns with Obsidian expectations. Prevent recurrence by introducing a blocking compliance gate that combines official Obsidian lint rules with repository-local regression guards covering all `src/**/*.ts`.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js 22 toolchain  
**Primary Dependencies**: Obsidian API, CodeMirror 6, esbuild, ESLint (`@typescript-eslint/*`), Vitest, Obsidian community lint rules (`eslint-plugin-obsidian`)  
**Storage**: N/A for new feature data; existing plugin settings store and vault markdown remain authoritative stores  
**Testing**: ESLint, Vitest unit/integration/perf suites, static compliance-guard tests  
**Target Platform**: Obsidian plugin runtime (desktop + mobile compatibility profile)  
**Project Type**: Single plugin project (`src/`, `tests/`)  
**Performance Goals**: No measurable regression in existing pane refresh and interaction tests; compliance checks complete within standard CI lint/test stage duration  
**Constraints**: Compliance failures are blocking for CI and release readiness; no functional regression of existing review/token workflows; preserve user pane placement across unload/load  
**Scale/Scope**: Remediation focused on current submission findings plus generalized guard coverage across all `src/**/*.ts`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. Clear Scope and Requirements**: PASS. Scope anchored to `spec.md` FR-001..FR-010 and clarified compliance decisions.
- **II. Maintainable Architecture**: PASS. Changes remain within existing plugin module boundaries and avoid introducing new coupling.
- **III. Quality and Testing**: PASS. Adds explicit regression checks; failures remain release-blocking.
- **IV. Security and Privacy**: PASS. No new external access paths or data collection behavior added.
- **V. Automation and Documentation**: PASS. Plan updates docs artifact for bot findings and enforces automated checks in lint/test gate.
- **Exceptions**: None.

### Post-Design Re-check (after Phase 1 artifacts)

- **I. Clear Scope and Requirements**: PASS. `research.md`, `data-model.md`, `contracts/`, and `quickstart.md` map directly to clarified FR/SC items.
- **II. Maintainable Architecture**: PASS. Design keeps remediation within existing modules and CSS/test boundaries.
- **III. Quality and Testing**: PASS. Design requires blocking gate and explicit regression enforcement paths.
- **IV. Security and Privacy**: PASS. No expansion of external interfaces beyond local CI/validation behavior.
- **V. Automation and Documentation**: PASS. Canonical model delta and operational quickstart are documented.

## Project Structure

### Documentation (this feature)

```text
specs/003-obsidian-bot-remediation/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- compliance-gate.openapi.yaml
|-- checklists/
|   `-- requirements.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- main.ts
|-- changes-view.ts
|-- comments-view.ts
|-- quick-actions-view.ts
|-- reading-view.ts
`-- ...

tests/
|-- unit/
|-- integration/
`-- perf/

docs/
|-- data-model.md
`-- obsidian_bot_checks_26-04-22.md
```

**Structure Decision**: Keep single-project plugin structure. Remediation touches existing view, settings, and rendering modules in `src/`, adds compliance guard tests in `tests/unit/`, and updates feature/canonical docs under `specs/` + `docs/`.

## Complexity Tracking

> No constitution violations identified for this feature.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
