# Tasks: Release Provenance and CSS Hygiene

**Input**: Design documents from `/specs/005-release-attestation-css/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include targeted unit/integration/CI-gate tests for release provenance enforcement and stylesheet warning remediation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Single project paths at repository root: `src/`, `tests/`, `scripts/`, `.github/workflows/`, `docs/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature documentation scaffolding and verification targets.

- [ ] T001 Reconcile implementation scope and acceptance evidence targets in `specs/005-release-attestation-css/spec.md` and `specs/005-release-attestation-css/quickstart.md`
- [ ] T002 [P] Document recommendation IDs, warning line references, and closure mapping in `docs/review-critic-obsidian-review-fix-plan.md`
- [ ] T003 [P] Confirm release-readiness contract routes and schema naming consistency in `specs/005-release-attestation-css/contracts/release-provenance-css.openapi.yaml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared release-gate and lint-rule foundations required by all user stories.

**WARNING**: No user story work can begin until this phase is complete.

- [ ] T004 Add release-gate assertions for required asset-attestation checks in `tests/unit/release-workflow.unit.test.ts`
- [ ] T005 [P] Extend release-readiness integration coverage for required provenance artifacts in `tests/integration/us-release-readiness.integration.test.ts`
- [ ] T006 [P] Add scoped stylesheet warning guard assertions for `!important` and duplicate selectors in `tests/unit/obsidian-bot-compliance.unit.test.ts`
- [ ] T007 Update CI/release gate policy documentation for scoped provenance and stylesheet warning checks in `docs/release-workflow.md`

**Checkpoint**: Shared validation baseline in place; user story work can proceed independently.

---

## Phase 3: User Story 1 - Verify Release Provenance for Published Assets (Priority: P1)

**Goal**: Ensure published release assets include verifiable attestation evidence for `main.js` and `styles.css`.

**Independent Test**: Publish a tagged release candidate and verify both required assets have attestation evidence and documented verification steps.

### Tests for User Story 1

- [ ] T008 [P] [US1] Add metadata/readiness unit assertions for required artifact coverage in `tests/unit/release-metadata.unit.test.ts`
- [ ] T009 [P] [US1] Add contract-level readiness assertions for provenance endpoints in `tests/integration/us-release-readiness.integration.test.ts`

### Implementation for User Story 1

- [ ] T010 [US1] Enforce required asset-attestation gate logic in `.github/workflows/release.yml`
- [ ] T011 [US1] Add/adjust release-check validations for required provenance expectations in `scripts/check-obsidian-release.mjs`
- [ ] T012 [US1] Update maintainer publication and provenance verification runbook steps in `docs/publication-checklist.md` and `specs/005-release-attestation-css/quickstart.md`
- [ ] T013 [US1] Record provenance recommendation closure evidence requirements in `specs/005-release-attestation-css/quickstart.md`

**Checkpoint**: User Story 1 delivers verifiable attestation coverage and readiness evidence for required artifacts.

---

## Phase 4: User Story 2 - Clear Scoped Stylesheet Lint Warnings (Priority: P2)

**Goal**: Eliminate targeted `styles.css` warnings for `!important` usage and duplicate selectors without UI regressions.

**Independent Test**: Run lint and targeted integration checks; confirm zero warnings for scoped findings and no regressions in reviewer-facing panes.

### Tests for User Story 2

- [ ] T014 [P] [US2] Add stylesheet regression assertions for review pane behavior in `tests/integration/us3-rendering.integration.test.ts`
- [ ] T015 [P] [US2] Add unit-level assertions covering selector behavior assumptions in `tests/unit/reading-view.unit.test.ts` and `tests/unit/comments-view.unit.test.ts`

### Implementation for User Story 2

- [ ] T016 [US2] Refactor targeted `!important` declarations by selector precedence updates in `styles.css`
- [ ] T017 [US2] Consolidate duplicate selector blocks (`.review-changes-toolbar`, `.review-quick-actions-row,.review-changes-controls-row`, `.review-track-toggle`, `.review-pane-separator`) in `styles.css`
- [ ] T018 [US2] Align scoped lint-guard rule descriptions and warning references in `tests/unit/obsidian-bot-compliance.unit.test.ts`
- [ ] T019 [US2] Update remediation status and evidence notes for scoped CSS warnings in `docs/review-critic-obsidian-review-fix-plan.md`

**Checkpoint**: User Story 2 delivers zero scoped stylesheet warnings and preserves review UI behavior.

---

## Phase 5: Polish and Cross-Cutting Concerns

**Purpose**: Finalize evidence, run end-to-end validation, and reconcile feature artifacts.

- [ ] T020 [P] Run full validation sequence, capture timed provenance verification evidence (<=10 minutes), and record results in `specs/005-release-attestation-css/quickstart.md`
- [ ] T021 Reconcile final plan/spec/tasks consistency and update FR-007 traceability notes in `specs/005-release-attestation-css/spec.md`, `specs/005-release-attestation-css/plan.md`, and `specs/005-release-attestation-css/tasks.md`
- [ ] T022 [P] Update canonical release guidance references for this feature in `docs/Obsidian Publication Guide.md`
- [ ] T023 Capture final readiness evidence linkage to contract endpoints in `specs/005-release-attestation-css/contracts/release-provenance-css.openapi.yaml` and `specs/005-release-attestation-css/quickstart.md`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all story implementation.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2 and can run independently of US1 implementation details.
- **Phase 5 (Polish)**: Depends on completion of US1 and US2.

### User Story Dependencies

- **US1 (P1)**: Starts after foundational completion.
- **US2 (P2)**: Starts after foundational completion; does not require US1 code changes to be complete.

### Within Each User Story

- Story-specific tests should be implemented before or alongside story code and must fail before final remediation.
- Workflow/checking changes should be completed before documentation evidence sign-off.
- CSS remediation must be complete before final scoped lint verification and evidence capture.

### Parallel Opportunities

- Phase 1 tasks `T002` and `T003` can run in parallel.
- Phase 2 tasks `T005` and `T006` can run in parallel after `T004`.
- US1 test tasks `T008` and `T009` can run in parallel.
- US2 test tasks `T014` and `T015` can run in parallel.
- Polish tasks `T020` and `T022` can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "Add metadata/readiness unit assertions for required artifact coverage in tests/unit/release-metadata.unit.test.ts"
Task: "Add contract-level readiness assertions for provenance endpoints in tests/integration/us-release-readiness.integration.test.ts"
```

## Parallel Example: User Story 2

```bash
Task: "Add stylesheet regression assertions for review pane behavior in tests/integration/us3-rendering.integration.test.ts"
Task: "Add unit-level assertions covering selector behavior assumptions in tests/unit/reading-view.unit.test.ts and tests/unit/comments-view.unit.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate provenance gates and attestation evidence before moving to US2.

### Incremental Delivery

1. Deliver US1 to close release-provenance recommendation gaps.
2. Deliver US2 to close scoped stylesheet warning gaps.
3. Run Phase 5 for integrated readiness evidence and publication guidance.

### Parallel Team Strategy

1. One contributor completes foundational gate updates.
2. After foundation, one contributor executes US1 workflow/checking tasks while another executes US2 stylesheet tasks.
3. Converge in Phase 5 to finalize evidence and validation logs.

---

## Notes

- [P] tasks are safe parallel targets when file overlap is avoided.
- [US1]/[US2] labels map each task to a single independently testable story.
- Keep edits scoped to the recommendation set defined in `spec.md`.
- Capture command outputs and evidence references in `quickstart.md` as tasks are completed.
