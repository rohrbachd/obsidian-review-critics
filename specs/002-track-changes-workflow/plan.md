# Implementation Plan: Track Changes Workflow

**Branch**: `002-track-changes-workflow` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-track-changes-workflow/spec.md`

## Summary

Implement Phase 2 review workflow capabilities in the existing Obsidian plugin: tracked editing for insert/delete/replace, accepted-text display mode, single-change accept/reject plus accept-all, quick review action buttons, changes pane actions, comments pane cleanup actions, and persisted named color theme presets. The implementation will extend existing parser, command, pane, and settings modules while preserving Markdown as the system of record for review markup and plugin settings as the system of record for user preferences.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 22 toolchain  
**Primary Dependencies**: Obsidian API, CodeMirror 6 (`@codemirror/view`, `@codemirror/state`), esbuild  
**Storage**: Obsidian Markdown files for review markup; plugin data store for settings/theme presets  
**Testing**: Vitest (`tests/unit`, `tests/integration`, `tests/perf`)  
**Target Platform**: Obsidian Desktop (primary), no regression for current non-desktop flag behavior  
**Project Type**: Single-plugin TypeScript project  
**Performance Goals**: No perceivable typing lag in common notes (<10k words); accept-all within user-facing target from spec  
**Constraints**: Local-first only, no network dependencies, deterministic text transforms, preserve undo/redo behavior  
**Scale/Scope**: Current-note scope for changes/comments panes; no whole-vault index in this phase

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. Clear Scope and Requirements**: PASS. Scope, exclusions, FRs, and measurable outcomes are explicit in spec.
- **II. Maintainable Architecture**: PASS with constraint. Plan keeps parser/transforms, panes, and settings concerns separated; no module boundary violations required.
- **III. Quality and Testing**: PASS with required additions. New tracked-transform and pane-action behavior requires new unit + integration tests before completion.
- **IV. Security and Privacy**: PASS. No new secrets, auth surfaces, or external transfer introduced.
- **V. Automation and Documentation**: PASS. Existing CI already runs build/lint/format/tests; docs artifacts for this feature are generated in this plan.

No exceptions requested.

## Project Structure

### Documentation (this feature)

```text
specs/002-track-changes-workflow/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- openapi.yaml
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- main.ts
|-- review-config.ts
|-- review-types.ts
|-- review-parser.ts
|-- review-commands.ts
|-- live-preview.ts
|-- reading-view.ts
`-- comments-view.ts

tests/
|-- unit/
|-- integration/
`-- perf/
```

**Structure Decision**: Keep single-project structure and extend existing modules. Add new focused helpers/types within `src/` for tracked-transform and theme preset handling if complexity exceeds current file cohesion.

## Phase 0: Research Plan

Research topics resolved in `research.md`:

1. Track-changes editing strategy in CodeMirror/Obsidian (transaction interception and safe transforms).
2. Rules for grouping/merging additions and deletions.
3. Accept/reject transform semantics for each token type.
4. Pane interaction model for quick actions and changes resolution.
5. Theme preset uniqueness/overwrite UX and persistence behavior.

## Phase 1: Design Outputs

Produce:

1. `data-model.md` with new feature entities and **Delta vs Canonical** section.
2. `contracts/openapi.yaml` capturing user-facing command/action contracts for pane and resolution operations.
3. `quickstart.md` with implementation and validation workflow.
4. Canonical update to `docs/data-model.md` for new/changed entities.
5. Agent context update via `.specify/scripts/powershell/update-agent-context.ps1 -AgentType codex`.

## Post-Design Constitution Re-Check

- **I. Scope**: PASS. Design artifacts map directly to P1-P7 stories.
- **II. Architecture**: PASS. Entities and contracts isolate concerns; no hidden global state required.
- **III. Testing**: PASS with follow-up. Tasks phase must include transform correctness and pane behavior tests as release blockers.
- **IV. Security/Privacy**: PASS. No data egress or external dependency introduced.
- **V. Automation/Docs**: PASS. Plan includes required docs and works with current CI pipeline.

## Complexity Tracking

No constitution violations requiring exception tracking.
