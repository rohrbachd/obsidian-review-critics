# Implementation Plan: Release Provenance and CSS Hygiene

**Branch**: `005-release-attestation-css` | **Date**: 2026-05-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-release-attestation-css/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Resolve release trust recommendations by guaranteeing attestation coverage for required published assets, and eliminate the scoped stylesheet lint warnings (`!important` and duplicate selectors) without changing reviewer-facing behavior.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js 22 toolchain, CSS  
**Primary Dependencies**: Obsidian API, CodeMirror 6, esbuild, ESLint toolchain, Vitest, GitHub Actions release workflow tooling  
**Storage**: Markdown vault files and plugin settings remain canonical runtime stores; release metadata and published release assets remain canonical release-readiness artifacts  
**Testing**: `npm run build`, `npm run check`, `npm run lint`, `npm run format:check`, `npm test`, `npm run release:check -- <version>` plus targeted assertions in release workflow, release metadata/readiness, rendering, and reading/comments regression suites  
**Target Platform**: Obsidian plugin runtime and GitHub-hosted CI/release pipeline  
**Project Type**: Single plugin project (`src/`, `tests/`, `.github/workflows/`, `docs/`)  
**Performance Goals**: No measurable regression in review pane responsiveness and rendering behavior after CSS cleanup  
**Constraints**: Required release assets must be published with attestations, release gates must remain automated, scoped CSS warnings must be reduced to zero, and no behavior-changing visual regressions are allowed in review workflows  
**Scale/Scope**: One incremental release-hardening feature touching release workflow/checks, stylesheet declarations, and release-readiness documentation

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **I. Clear Scope and Requirements**: PASS. Scope is bounded to attestation coverage and a finite warning set from the review feedback.
- **II. Maintainable Architecture**: PASS. Changes remain in existing workflow, stylesheet, tests, and documentation boundaries.
- **III. Quality and Testing**: PASS. Plan requires explicit release-gate and scoped lint validation before rollout.
- **IV. Security and Privacy**: PASS. Provenance attestation enforcement strengthens release integrity.
- **V. Automation and Documentation**: PASS. Workflow and runbook updates are included as required deliverables.
- **Exceptions**: None.

### Post-Design Re-check (after Phase 1 artifacts)

- **I. Clear Scope and Requirements**: PASS. `research.md`, `data-model.md`, `contracts/`, and `quickstart.md` all map directly to FR-001 through FR-007 and NFR-001 through NFR-004.
- **II. Maintainable Architecture**: PASS. Design uses existing release entities and avoids introducing new runtime module boundaries.
- **III. Quality and Testing**: PASS. Quickstart and contract require reproducible validation and evidence capture.
- **IV. Security and Privacy**: PASS. Attestation verification remains a mandatory readiness condition.
- **V. Automation and Documentation**: PASS. Planning artifacts capture automation and reviewer-facing evidence expectations.

## Project Structure

### Documentation (this feature)

```text
specs/005-release-attestation-css/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- release-provenance-css.openapi.yaml
|-- checklists/
|   `-- requirements.md
`-- tasks.md
```

### Source Code (repository root)

```text
.github/workflows/
|-- ci.yml
`-- release.yml

docs/
|-- data-model.md
|-- publication-checklist.md
`-- release-workflow.md

scripts/
`-- check-obsidian-release.mjs

styles.css

tests/
|-- unit/
|   |-- release-workflow.unit.test.ts
|   |-- release-metadata.unit.test.ts
|   |-- obsidian-bot-compliance.unit.test.ts
|   |-- reading-view.unit.test.ts
|   `-- comments-view.unit.test.ts
`-- integration/
    |-- us-release-readiness.integration.test.ts
    `-- us3-rendering.integration.test.ts
```

**Structure Decision**: Keep the current single-project plugin structure and limit implementation to release workflow/checking, stylesheet cleanup, and documentation/evidence assets. No repository layout changes are needed.

## Phase 0: Outline & Research

Research tasks derived from the spec and technical context:

1. Define the minimum enforceable attestation coverage rule for required release assets and how to detect gaps deterministically.
2. Select the least-risk CSS refactoring approach to remove `!important` and duplicate selectors while preserving current UI behavior.
3. Define reviewer-facing evidence expectations so recommendation closure is demonstrable in resubmission.
4. Confirm regression validation strategy for release automation and stylesheet behavior.

Output: `research.md` with decisions, rationale, and rejected alternatives.

## Phase 1: Design & Contracts

Design outputs:

1. Produce `data-model.md` with a Delta vs Canonical section against `docs/data-model.md`.
2. Keep canonical model unchanged unless new entities/fields are required; if required, update `docs/data-model.md`.
3. Define logical readiness contract in `contracts/release-provenance-css.openapi.yaml`.
4. Produce `quickstart.md` runbook for local checks, release publication, attestation verification, and closure evidence capture.
5. Update agent context:
   - `.specify/scripts/powershell/update-agent-context.ps1 -AgentType codex`

## Complexity Tracking

> No constitution violations identified for this feature.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |
