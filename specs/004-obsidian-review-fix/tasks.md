# Tasks: Obsidian Review Feedback Remediation

**Input**: Design documents from `/specs/004-obsidian-review-fix/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are in scope for this feature. Run `npm run build`, `npm run check`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run release:check -- 1.1.1`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project paths under `src/`, `tests/`, `docs/`, `.github/workflows/`, and `specs/`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare implementation scaffolding and review-tracking context.

- [x] T001 Reconcile release-remediation scope references in `docs/review-critic-obsidian-review-fix-plan.md` and `specs/004-obsidian-review-fix/quickstart.md`
- [x] T002 [P] Create metadata/readiness regression test scaffolds in `tests/unit/release-metadata.unit.test.ts` and `tests/unit/release-workflow.unit.test.ts`
- [x] T003 [P] Create release-readiness integration test scaffold in `tests/integration/us-release-readiness.integration.test.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared guardrails and readiness tracking required by all user stories.

**WARNING**: No user story work can begin until this phase is complete.

- [x] T004 Add 2026-05-07 canonical review-finding baseline entries (`RF-001` through `RF-007`) in `docs/review-critic-obsidian-review-fix-plan.md`
- [x] T005 [P] Extend compliance guard coverage for flagged API/DOM patterns in `tests/unit/obsidian-bot-compliance.unit.test.ts`
- [x] T006 [P] Add release metadata consistency assertions to `scripts/check-obsidian-release.mjs` and `tests/unit/release-metadata.unit.test.ts`

**Checkpoint**: Foundation ready; user stories can be implemented independently.

---

## Phase 3: User Story 1 - Publish Accurate Compatibility Metadata (Priority: P1)

**Goal**: Remove the hard review blocker by shipping accurate compatibility metadata for release `1.1.1`.

**Independent Test**: Metadata assertions pass and show `manifest.json`, `package.json`, and `versions.json` are internally consistent with `1.1.1 -> 1.7.2` while historical mappings remain unchanged.

### Tests for User Story 1

- [x] T007 [P] [US1] Implement metadata consistency tests for version and min-app mapping in `tests/unit/release-metadata.unit.test.ts`
- [x] T008 [P] [US1] Add release-check validation case for `1.1.1` in `tests/integration/us-release-readiness.integration.test.ts`

### Implementation for User Story 1

- [x] T009 [US1] Update plugin release metadata to `1.1.1` and `1.7.2` in `manifest.json`
- [x] T010 [US1] Update package release version to `1.1.1` in `package.json`
- [x] T011 [US1] Append compatibility mapping `"1.1.1": "1.7.2"` in `versions.json`
- [x] T012 [US1] Ensure release-check logic validates the new metadata/tag pair in `scripts/check-obsidian-release.mjs`
- [x] T013 [US1] Document blocker-resolution evidence for `RF-001` compatibility mismatch in `docs/review-critic-obsidian-review-fix-plan.md`

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Resolve Review Warnings Without Regressions (Priority: P2)

**Goal**: Clear warning-level findings while preserving live preview, reading view, comments pane, and popout behavior.

**Independent Test**: Warning-targeted unit/integration checks pass and existing rendering/interaction tests remain green.

### Tests for User Story 2

- [x] T014 [P] [US2] Add helper-usage rendering regression assertions in `tests/unit/live-preview.unit.test.ts` and `tests/unit/reading-view.unit.test.ts`
- [x] T015 [P] [US2] Add comments-pane structure assertions for helper migration in `tests/unit/comments-view.unit.test.ts`
- [x] T016 [P] [US2] Add popout-safe document-owner behavior coverage in `tests/integration/us3-rendering.integration.test.ts`

### Implementation for User Story 2

- [x] T017 [US2] Replace deprecated module-list import usage with Node native builtins in `esbuild.config.mjs`
- [x] T018 [US2] Remove `builtin-modules` dependency and refresh lockfile in `package.json` and `package-lock.json`
- [x] T019 [US2] Add direct `@codemirror/state` and `@codemirror/view` dependencies in `package.json` and `package-lock.json`
- [x] T020 [US2] Replace `createEl('div', ...)` with `createDiv(...)` in flagged comment-pane blocks in `src/comments-view.ts`
- [x] T021 [US2] Replace direct element creation with helper APIs in `src/live-preview.ts`
- [x] T022 [US2] Replace document-dependent rendering calls with helper/owner-document APIs in `src/reading-view.ts`
- [x] T023 [US2] Replace global document-root access with active-document-compatible root handling in `src/main.ts`
- [x] T024 [US2] Update warning-remediation evidence status for `RF-002` through `RF-007` in `docs/review-critic-obsidian-review-fix-plan.md`

**Checkpoint**: User Story 2 is fully functional and independently testable.

---

## Phase 5: User Story 3 - Release with Attested Assets and Resubmission Evidence (Priority: P3)

**Goal**: Automate build, attestation, and release asset publishing for `1.1.1` and capture resubmission evidence.

**Independent Test**: Tag-triggered release workflow definition validates required checks and attestation/publish steps for `main.js`, `manifest.json`, and `styles.css`.

### Tests for User Story 3

- [x] T025 [P] [US3] Add workflow-gate assertions for release checks and artifact list in `tests/unit/release-workflow.unit.test.ts`
- [x] T026 [P] [US3] Add release-readiness integration assertion for required provenance artifacts in `tests/integration/us-release-readiness.integration.test.ts`

### Implementation for User Story 3

- [x] T027 [US3] Create tag-triggered attested release workflow in `.github/workflows/release.yml`
- [x] T028 [US3] Align release-check behavior and workflow gate expectations in `scripts/check-obsidian-release.mjs` and `.github/workflows/release.yml`
- [x] T029 [US3] Document automated release + attestation verification process in `docs/release-workflow.md` and `docs/publication-checklist.md`
- [x] T030 [US3] Record resubmission evidence procedure and contract linkage in `specs/004-obsidian-review-fix/quickstart.md` and `specs/004-obsidian-review-fix/contracts/release-readiness.openapi.yaml`

**Checkpoint**: User Story 3 is fully functional and independently testable.

---

## Phase 6: Polish and Cross-Cutting Concerns

**Purpose**: Final verification, documentation consistency, and release readiness sign-off.

- [x] T031 [P] Run full validation sequence for `1.1.1` and capture outcomes in `specs/004-obsidian-review-fix/quickstart.md`
- [x] T032 Prepare final publication/resubmission notes in `docs/Obsidian Publication Guide.md`
- [x] T033 Reconcile final spec/plan/tasks consistency after performance delta capture in `specs/004-obsidian-review-fix/spec.md`, `specs/004-obsidian-review-fix/plan.md`, and `specs/004-obsidian-review-fix/tasks.md`
- [x] T034 Run targeted performance regression checks in `tests/perf/us1-track-typing-latency.perf.test.ts` and `tests/perf/us3-pane-refresh.perf.test.ts`, and record baseline deltas in `specs/004-obsidian-review-fix/quickstart.md`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: no dependencies.
- **Phase 2 (Foundational)**: depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: depends on Phase 2.
- **Phase 4 (US2)**: depends on Phase 2; can proceed in parallel with US1 where file ownership does not overlap.
- **Phase 5 (US3)**: depends on Phase 2; full acceptance depends on US1 and US2 outputs passing workflow gates.
- **Phase 6 (Polish)**: depends on completion of targeted user stories.

### User Story Dependencies

- **US1 (P1)**: independent after Foundational; provides blocker-resolution MVP value.
- **US2 (P2)**: independent after Foundational; validates warning remediation and behavior stability.
- **US3 (P3)**: independently implementable after Foundational, but final readiness depends on US1 and US2 passing checks.

### Within Each User Story

- Add/update tests before finalizing implementation changes.
- Metadata/dependency/source edits before documentation evidence updates.
- Story must satisfy its independent test before advancing.

### Parallel Opportunities

- Setup: `T002` and `T003` can run in parallel.
- Foundational: `T005` and `T006` can run in parallel after `T004`.
- US1: `T007` and `T008` parallel; then `T009-T012` sequence.
- US2: `T014`, `T015`, and `T016` parallel; then `T017/T020/T021/T022` can proceed in parallel on separate files.
- US3: `T025` and `T026` parallel; then `T027` and `T029` can proceed in parallel.
- Polish: `T031` runs first; `T034` runs after `T031` to record performance deltas; `T033` runs after `T034` to finalize consistency with performance outcomes.

---

## Parallel Example: User Story 2

```bash
# Parallel tests
Task: "T014 [US2] helper-usage regressions in tests/unit/live-preview.unit.test.ts and tests/unit/reading-view.unit.test.ts"
Task: "T015 [US2] comments-view helper assertions in tests/unit/comments-view.unit.test.ts"
Task: "T016 [US2] popout/document-owner behavior in tests/integration/us3-rendering.integration.test.ts"

# Parallel implementation on separate files
Task: "T017 [US2] builtins import migration in esbuild.config.mjs"
Task: "T020 [US2] createDiv migration in src/comments-view.ts"
Task: "T021 [US2] element helper migration in src/live-preview.ts"
Task: "T022 [US2] document-owner/helper migration in src/reading-view.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 with metadata checks and `npm run release:check -- 1.1.1`.
4. Stop and confirm blocker-resolution readiness.

### Incremental Delivery

1. Deliver US1 first (review blocker removal).
2. Deliver US2 next (warning remediation + regression stability).
3. Deliver US3 (attested automation + evidence).
4. Execute Phase 6 for final readiness confirmation.

### Parallel Team Strategy

1. Developer A: metadata and all `package.json`/version-map edits (`T007-T013`, `T017-T019` sequencing).
2. Developer B: source-level DOM/popout remediations and warning evidence updates (`T014-T024` minus package metadata edits).
3. Developer C: release workflow, release-check integration, and publication docs (`T025-T030`).

---

## Notes

- `[P]` tasks are parallel-safe only when file edits do not overlap.
- `[US1]`, `[US2]`, and `[US3]` labels map directly to prioritized user stories.
- Keep historical release mappings unchanged while appending the new mapping.
- Treat failed validation checks and missing attestations as blocking for resubmission.
