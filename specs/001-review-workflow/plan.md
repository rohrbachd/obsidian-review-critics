# Implementation Plan: Obsidian Review Workflow v1

**Branch**: `001-review-workflow` | **Date**: 2026-04-17 | **Spec**: [/d:/Development/obsidian-critics/specs/001-review-workflow/spec.md](/d:/Development/obsidian-critics/specs/001-review-workflow/spec.md)
**Input**: Feature specification from `/specs/001-review-workflow/spec.md`

## Summary

Implement a markdown-native review workflow for Obsidian Desktop with CriticMarkup-inspired parsing, insertion commands, reading/live-preview rendering, and a current-note comments pane with click-to-navigate behavior. The plan prioritizes strict source preservation, predictable parsing (including explicit v1 restrictions on nested tokens), and testable acceptance criteria aligned to the PRD.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 22 runtime for build tooling  
**Primary Dependencies**: Obsidian API, CodeMirror 6 (`@codemirror/view`, `@codemirror/state`), esbuild  
**Storage**: Markdown note files (system of record) + Obsidian plugin data store for settings  
**Testing**: TypeScript compiler checks (`tsc --noEmit`), executable unit tests per module, executable integration tests for user flows, and performance benchmarks for success criteria validation  
**Target Platform**: Obsidian Desktop (primary), Obsidian app runtime compatibility where APIs overlap
**Project Type**: Single plugin project  
**Performance Goals**: Comments pane refresh <=500 ms for 50 review tokens; rendering/decorations remain interactive during normal editing  
**Constraints**: No silent source mutation; no automatic track changes; nested CriticMarkup parsed as plain text in v1; code-fence exclusion is mandatory  
**Scale/Scope**: Single active note review scope; tens of comments per note; v1 excludes whole-vault indexing

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Principle I (Clear Scope and Requirements): Pass. Scope and acceptance metrics are explicit in spec.
- Principle II (Maintainable Architecture): Pass. Parser, rendering, and pane concerns are isolated modules.
- Principle III (Quality and Testing): Pass with follow-up. Plan requires parser-focused tests and runnable checks before release.
- Principle IV (Security and Privacy): Pass. Local-only workflow, no external secrets or services.
- Principle V (Automation and Documentation): Pass. Build/check commands and docs are included in quickstart and plan outputs.
- Exception recorded in spec remains acknowledged: constitution document references legacy file names and is interpreted as a policy-level requirement.

Post-design re-check:

- No new constitution violations introduced by Phase 1 artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/001-review-workflow/
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
|-- comments-view.ts
|-- live-preview.ts
|-- main.ts
|-- reading-view.ts
|-- review-constants.ts
|-- review-parser.ts
`-- review-types.ts

docs/
`-- data-model.md

specs/
`-- 001-review-workflow/
```

**Structure Decision**: Use the existing single-project plugin layout under `src/` and add feature design artifacts under `specs/001-review-workflow/`. Canonical conceptual model is maintained in `docs/data-model.md`.

## Phase 0: Research Output

- Output document: [/d:/Development/obsidian-critics/specs/001-review-workflow/research.md](/d:/Development/obsidian-critics/specs/001-review-workflow/research.md)
- All technical context unknowns resolved; no unresolved NEEDS CLARIFICATION markers remain.

## Phase 1: Design Output

- Data model: [/d:/Development/obsidian-critics/specs/001-review-workflow/data-model.md](/d:/Development/obsidian-critics/specs/001-review-workflow/data-model.md)
- Contracts: [/d:/Development/obsidian-critics/specs/001-review-workflow/contracts/openapi.yaml](/d:/Development/obsidian-critics/specs/001-review-workflow/contracts/openapi.yaml)
- Quickstart: [/d:/Development/obsidian-critics/specs/001-review-workflow/quickstart.md](/d:/Development/obsidian-critics/specs/001-review-workflow/quickstart.md)
- Canonical data model baseline updated: [/d:/Development/obsidian-critics/docs/data-model.md](/d:/Development/obsidian-critics/docs/data-model.md)
- Agent context update script executed for Codex.

## Phase 2: Task Planning Readiness

The feature is ready for `/speckit.tasks` generation. Design artifacts map directly to user stories and functional requirements FR-001 through FR-018.

## Complexity Tracking

No justified constitution violations required at planning time.
