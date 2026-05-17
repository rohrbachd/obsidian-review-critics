# Implementation Plan: Obsidian Review Feedback Remediation

**Branch**: `004-obsidian-review-fix` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-obsidian-review-fix/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Deliver patch release `1.1.1` that resolves the May 7, 2026 Obsidian review blocker and related warnings by correcting compatibility metadata, remediating flagged source patterns without behavior regressions, and publishing attested release assets through automated release validation.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js 22 toolchain  
**Primary Dependencies**: Obsidian API, CodeMirror 6 (`@codemirror/state`, `@codemirror/view`), esbuild, ESLint (`@typescript-eslint/*`, `eslint-plugin-obsidian`), Vitest, GitHub Actions release tooling  
**Storage**: Existing plugin settings store and vault markdown remain authoritative runtime stores; release metadata files (`manifest.json`, `versions.json`, `package.json`) are authoritative for compatibility declarations  
**Testing**: npm build/check/lint/format/test/release-check workflow plus targeted review-remediation regression checks  
**Target Platform**: Obsidian plugin runtime (desktop-first, popout-compatible) and GitHub-hosted release pipeline  
**Project Type**: Single plugin project (`src/`, `tests/`, `.github/workflows/`)  
**Performance Goals**: No measurable regression in reading/live preview responsiveness for normal note interactions; release validation completes within existing CI envelope  
**Constraints**: Release tag must match metadata version exactly (`x.y.z`), compatibility declaration must be truthful to APIs in use, attestation must cover all required assets before publication, no historical release mapping rewrites  
**Scale/Scope**: One patch release (`1.1.1`) covering metadata correction, warning remediation in flagged files, dependency declaration updates, and release automation hardening

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. Clear Scope and Requirements**: PASS. Scope bounded to FR-001..FR-012 in feature spec.
- **II. Maintainable Architecture**: PASS. Changes stay within existing plugin and workflow boundaries; no cross-module architecture expansion.
- **III. Quality and Testing**: PASS. Plan requires full local validation sequence before release publication.
- **IV. Security and Privacy**: PASS. Provenance requirements and controlled release automation improve distribution integrity.
- **V. Automation and Documentation**: PASS. Release workflow and remediation documentation are explicit deliverables.
- **Exceptions**: None.

### Post-Design Re-check (after Phase 1 artifacts)

- **I. Clear Scope and Requirements**: PASS. `research.md`, `data-model.md`, `contracts/`, and `quickstart.md` map directly to blockers/warnings/resubmission outcomes.
- **II. Maintainable Architecture**: PASS. Design keeps remediation isolated to existing source files and release pipeline configuration.
- **III. Quality and Testing**: PASS. Contract and quickstart explicitly require all release gates and regression-sensitive checks.
- **IV. Security and Privacy**: PASS. Artifact attestations and release gating are preserved as non-optional controls.
- **V. Automation and Documentation**: PASS. Canonical model delta and release runbook are documented and reproducible.

## Project Structure

### Documentation (this feature)

```text
specs/004-obsidian-review-fix/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- release-readiness.openapi.yaml
|-- checklists/
|   `-- requirements.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- main.ts
|-- live-preview.ts
|-- reading-view.ts
|-- comments-view.ts
`-- ...

.github/workflows/
`-- release.yml

tests/
|-- unit/
|-- integration/
`-- perf/

docs/
|-- data-model.md
`-- review-critic-obsidian-review-fix-plan.md
```

**Structure Decision**: Keep the single-project plugin structure and apply remediation to existing source modules plus one release workflow. Planning artifacts live under `specs/004-obsidian-review-fix/` and canonical conceptual model updates remain in `docs/data-model.md`.

## Phase 0: Outline & Research

Research tasks derived from spec and technical context:

1. Confirm lowest-risk strategy for compatibility blocker resolution versus API fallback replacement.
2. Confirm best-practice replacement for deprecated module metadata dependency usage.
3. Confirm popout-safe document/DOM helper patterns for Obsidian plugin surfaces.
4. Confirm minimum practical release provenance workflow for Obsidian plugin assets.
5. Confirm version/tag validation guard patterns to prevent inconsistent patch releases.

Output: `research.md` with decisions, rationale, and rejected alternatives.

## Phase 1: Design & Contracts

Design outputs:

1. Define/update entities in `data-model.md` and include Delta vs Canonical section.
2. Update canonical baseline in `docs/data-model.md` with newly introduced release-review entities.
3. Define logical release-readiness and remediation contract in `contracts/release-readiness.openapi.yaml`.
4. Produce `quickstart.md` runbook for local validation, release tagging, and post-release attestation verification.
5. Update agent context:
   - `.specify/scripts/powershell/update-agent-context.ps1 -AgentType codex`

## Complexity Tracking

> No constitution violations identified for this feature.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |

## Implementation Reconciliation (2026-05-17)

- `spec.md` canonical findings baseline (`RF-001` through `RF-007`) matches remediation tracking in `docs/review-critic-obsidian-review-fix-plan.md`.
- `tasks.md` completion sequencing for validation/perf reconciliation follows `T031 -> T034 -> T033`.
- `quickstart.md` now records validation gate outcomes and performance evidence for this implementation cycle.
