# Implementation Plan: Track Changes Workflow

**Branch**: `002-track-changes-workflow` | **Date**: 2026-04-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-track-changes-workflow/spec.md`

## Summary

Implement and stabilize the Phase 2 review workflow with safety-first track-changes behavior for syntax-sensitive Markdown content. The plan extends the existing feature with clarified rules from the updated spec: bypassed structural edits are not listed in the changes pane, first bypass triggers one non-blocking session notice, mixed inline/structural edits bypass whole-transaction transforms, quick actions on protected selections are safe no-op with notice, and accepted-text mode renders structural resolved projection while keeping source markup unchanged.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 22 toolchain  
**Primary Dependencies**: Obsidian API, CodeMirror 6 (`@codemirror/state`, `@codemirror/view`), esbuild  
**Storage**: Markdown note files for review source-of-record; plugin settings store for mode/theme preferences  
**Testing**: Vitest (unit/integration/perf)  
**Target Platform**: Obsidian Desktop (primary)  
**Project Type**: Single plugin project  
**Performance Goals**: For common notes under 10,000 words, p95 tracked-edit processing latency (single-cursor insert/delete transaction in automated perf harness) <= 50 ms; no editor range/deco runtime errors in mixed-markdown scenarios; accept-all behavior remains within existing success criteria  
**Constraints**: Safety-first transform policy; no silent content corruption; deterministic behavior; local-only (no network/telemetry)  
**Scale/Scope**: Current note scope; markdown constructs include inline and syntax-sensitive structural content (tables, headings/lists, callouts, code/math blocks, separators, links/footnotes)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. Clear Scope and Requirements**: PASS. Updated spec includes explicit clarifications and measurable acceptance criteria for structural bypass and accepted-text projection behavior.
- **II. Maintainable Architecture**: PASS. Plan preserves module boundaries (`track-changes`, `live-preview`, `reading-view`, `changes-view`) and adds policy rules instead of ad-hoc per-case hacks.
- **III. Quality and Testing**: PASS with required regressions. Added rules require explicit unit/integration coverage for protected selections, one-time notice, mixed-selection bypass, and structural accepted-text rendering.
- **IV. Security and Privacy**: PASS. No external services or secret handling changes; local-only behavior retained.
- **V. Automation and Documentation**: PASS. Existing quality gates remain; docs/spec artifacts updated in-place.

No constitution exceptions are requested.

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
|-- track-changes.ts
|-- live-preview.ts
|-- reading-view.ts
|-- changes-view.ts
|-- review-parser.ts
|-- review-types.ts
`-- review-config.ts

tests/
|-- unit/
|-- integration/
`-- perf/
```

**Structure Decision**: Keep the single-plugin structure and extend existing modules with explicit policy boundaries: track-transform policy in `track-changes.ts`, presentation semantics in `live-preview.ts` and `reading-view.ts`, and pane-list semantics in `changes-view.ts`.

## Phase 0: Outline & Research

Research updates required from clarified spec changes:

1. Changes-pane semantics for bypassed structural edits (explicitly excluded from pane listing).
2. Bypass feedback policy (single non-blocking notice per session).
3. Mixed selection policy (if any syntax-sensitive overlap exists, bypass full transaction).
4. Quick-action protected-selection handling (safe no-op with notice).
5. Accepted-text structural projection behavior and rendering safety constraints.

Output: updated `research.md` with decisions/rationale/alternatives for each item.

## Phase 1: Design & Contracts

Design artifacts to synchronize with new clarified behavior:

1. Update `data-model.md` (Delta vs Canonical) with behavioral constraints for `TrackedChangeEntry` and `QuickActionRequest` outcomes.
2. Update `contracts/openapi.yaml` to reflect:
   - changes listing excludes bypassed structural edits,
   - quick-action protected-selection no-op outcome,
   - accepted-text display semantics for structural projection.
3. Update `quickstart.md` with manual validation checks for:
   - single-session bypass notice,
   - quick-action protected selection no-op,
   - mixed selection whole-transaction bypass,
   - accepted-text structural rendering correctness.
4. Run agent context updater script:
   - `.specify/scripts/powershell/update-agent-context.ps1 -AgentType codex`

If no new canonical entities/fields are introduced, `docs/data-model.md` remains unchanged.

## Post-Design Constitution Re-Check

- **I. Scope**: PASS. Clarifications are now reflected in design artifacts and testable workflows.
- **II. Architecture**: PASS. Safety policies are centralized and avoid cross-module leakage.
- **III. Quality**: PASS pending implementation of added regression tests.
- **IV. Security/Privacy**: PASS. No added external surfaces.
- **V. Automation/Docs**: PASS. Updated docs and contracts are included in this plan cycle.

## Complexity Tracking

No constitution violations requiring exception tracking.
