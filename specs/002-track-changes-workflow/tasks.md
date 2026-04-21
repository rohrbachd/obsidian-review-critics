# Tasks: Track Changes Workflow

**Input**: Design documents from `/specs/002-track-changes-workflow/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are in scope for this feature. Add and run unit, integration, and perf coverage for each user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create feature scaffolding and baseline artifacts used by all stories.

- [x] T001 Create Phase 2 module scaffolds in `src/track-changes.ts`, `src/change-resolution.ts`, `src/changes-view.ts`, `src/quick-actions-view.ts`, `src/display-mode.ts`, and `src/theme-presets.ts`
- [x] T002 Extend shared types/constants for Phase 2 command and state keys in `src/review-types.ts` and `src/review-constants.ts`
- [x] T003 [P] Add Phase 2 markdown fixtures for tracked-edit scenarios in `tests/fixtures/track-changes-phase2.md`
- [x] T004 [P] Add Phase 2 markdown fixtures for pane/theme scenarios in `tests/fixtures/review-workflow-phase2.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story implementation.

**WARNING**: No user story work should begin before this phase is complete.

- [x] T005 Add parser support for stable tracked-change ranges and metadata in `src/review-parser.ts` and `src/review-types.ts`
- [x] T006 Add shared active-editor and cursor/selection helpers in `src/review-commands.ts`
- [x] T007 Add persisted settings fields and defaults for track/display/theme state in `src/main.ts`, `src/review-config.ts`, and `src/review-types.ts`
- [x] T008 Register baseline commands and view types for Phase 2 panes in `src/main.ts` and `src/review-constants.ts`
- [x] T009 [P] Extend Obsidian mocks for new commands/views used in tests in `tests/mocks/obsidian.ts`
- [x] T010 [P] Add foundational parser/settings regression tests in `tests/unit/review-parser.test.ts` and `tests/unit/main.unit.test.ts`

**Checkpoint**: Foundation ready. User stories can now be implemented and tested independently.

---

## Phase 3: User Story 1 - Track Edits While Typing (Priority: P1)

**Goal**: Automatically capture additions, deletions, and substitutions while editing with merge/grouping behavior.

**Independent Test**: Enable Track Changes Mode, perform insert/delete/replace flows, and verify generated markup and grouping rules.

### Tests for User Story 1

- [x] T011 [P] [US1] Add unit tests for tracked transform rules and safety fallbacks in `tests/unit/track-changes.unit.test.ts`
- [x] T012 [P] [US1] Add integration tests for insert/delete/replace and merge behavior in `tests/integration/us1-track-changes.integration.test.ts`
- [x] T013 [P] [US1] Add perf test for typing latency with track mode enabled that asserts SC-002 p95 tracked-edit latency <= 50 ms in `tests/perf/us1-track-typing-latency.perf.test.ts`

### Implementation for User Story 1

- [x] T014 [US1] Implement transaction interception and deterministic tracked-edit transforms in `src/track-changes.ts`
- [x] T015 [US1] Implement addition extension/adjacent merge and deletion merge rules in `src/track-changes.ts`
- [x] T016 [US1] Wire track mode toggle command/state indicator and persistence in `src/review-commands.ts`, `src/main.ts`, and `src/review-config.ts`
- [x] T017 [US1] Integrate track-edit pipeline with editor command flow and undo-safe dispatch in `src/main.ts` and `src/review-commands.ts`

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Review Text As Accepted (Priority: P2)

**Goal**: Toggle accepted-text display that resolves editorial tokens visually while keeping comments visible.

**Independent Test**: Switch between markup-aware and accepted-text display and verify reversible visual behavior.

### Tests for User Story 2

- [x] T018 [P] [US2] Add unit tests for accepted-text display transforms in `tests/unit/display-mode.unit.test.ts`
- [x] T019 [P] [US2] Add integration tests for display toggle and comment visibility in `tests/integration/us2-accepted-text-view.integration.test.ts`

### Implementation for User Story 2

- [x] T020 [US2] Implement accepted-text display transform helpers in `src/display-mode.ts`
- [x] T021 [US2] Apply accepted-text display behavior in live preview rendering in `src/live-preview.ts`
- [x] T022 [US2] Apply accepted-text display behavior in reading view rendering in `src/reading-view.ts`
- [x] T023 [US2] Add display-mode toggle command and persisted setting flow in `src/review-commands.ts`, `src/main.ts`, and `src/review-config.ts`

**Checkpoint**: User Story 2 is independently functional and testable.

---

## Phase 5: User Story 3 - Accept or Reject Individual Changes and Accept Bulk Changes (Priority: P3)

**Goal**: Resolve tracked edits via accept/reject per change and accept-all for current note.

**Independent Test**: Resolve each change type individually and run accept-all on multi-change fixtures.

### Tests for User Story 3

- [x] T024 [P] [US3] Add unit tests for accept/reject token resolution transforms in `tests/unit/change-resolution.unit.test.ts`
- [x] T025 [P] [US3] Add integration tests for single-change resolve and accept-all workflows in `tests/integration/us3-change-resolution.integration.test.ts`
- [x] T026 [P] [US3] Add perf test for accept-all on 50 changes in `tests/perf/us3-accept-all-latency.perf.test.ts`

### Implementation for User Story 3

- [x] T027 [US3] Implement accept/reject/accept-all transform engine for additions, deletions, and substitutions in `src/change-resolution.ts`
- [x] T028 [US3] Add commands for accept/reject single change and accept-all current note in `src/review-commands.ts`
- [x] T029 [US3] Wire command handlers to parser range lookup and active editor updates in `src/main.ts` and `src/review-parser.ts`

**Checkpoint**: User Story 3 is independently functional and testable.

---

## Phase 6: User Story 4 - Quick Review Actions in a Pane (Priority: P4)

**Goal**: Provide pane buttons for add/delete/highlight/replace/comment with selection-aware behavior.

**Independent Test**: Use quick-action buttons at cursor and with selection; verify no-op/error handling rules.

### Tests for User Story 4

- [x] T030 [P] [US4] Add unit tests for quick-action selection/no-selection rules, including replacement action no-op behavior, in `tests/unit/quick-actions-view.unit.test.ts`
- [x] T031 [P] [US4] Add integration tests for quick-action pane button workflows, including replacement action application, in `tests/integration/us4-quick-actions-pane.integration.test.ts`

### Implementation for User Story 4

- [x] T032 [US4] Implement quick actions pane UI and button event wiring in `src/quick-actions-view.ts`
- [x] T033 [US4] Implement quick-action command handlers including Add/Comment insert, replacement action behavior, and no-op cases in `src/review-commands.ts`
- [x] T034 [US4] Register quick-actions view open/focus command and workspace lifecycle in `src/main.ts`
- [x] T035 [US4] Add clear user notices for no active Markdown editor cases in `src/quick-actions-view.ts` and `src/review-commands.ts`

**Checkpoint**: User Story 4 is independently functional and testable.

---

## Phase 7: User Story 5 - Review Pending Changes in a Pane (Priority: P5)

**Goal**: Show tracked changes list with navigation and resolution actions.

**Independent Test**: Open changes pane, navigate to entries, and resolve items from pane controls.

### Tests for User Story 5

- [x] T036 [P] [US5] Add unit tests for tracked-change entry mapping and empty state in `tests/unit/changes-view.unit.test.ts`
- [x] T037 [P] [US5] Add integration tests for changes pane listing, navigation, and actions with under-5-second navigation assertions in `tests/integration/us5-changes-pane.integration.test.ts`

### Implementation for User Story 5

- [x] T038 [US5] Implement changes pane rendering and entry models in `src/changes-view.ts`
- [x] T039 [US5] Implement tracked-change extraction and context generation in `src/review-parser.ts` and `src/changes-view.ts`
- [x] T040 [US5] Wire pane selection-to-editor navigation in `src/changes-view.ts` and `src/main.ts`
- [x] T041 [US5] Wire pane accept/reject/accept-all actions to resolution commands in `src/changes-view.ts` and `src/review-commands.ts`

**Checkpoint**: User Story 5 is independently functional and testable.

---

## Phase 8: User Story 6 - Resolve Comments from the Comments Pane (Priority: P6)

**Goal**: Add direct resolve/remove actions for standalone and anchored comments.

**Independent Test**: Resolve each comment type from pane and verify markup removal while keeping reviewed text readable.

### Tests for User Story 6

- [x] T042 [P] [US6] Add unit tests for comments-pane resolve action enablement and transforms in `tests/unit/comments-view-resolve.unit.test.ts`
- [x] T043 [P] [US6] Add integration tests for standalone and anchored comment resolve workflows in `tests/integration/us6-comments-resolve.integration.test.ts`

### Implementation for User Story 6

- [x] T044 [US6] Add resolve/remove controls and callbacks to comments pane entries in `src/comments-view.ts`
- [x] T045 [US6] Implement comment cleanup transforms for standalone and anchored comments in `src/change-resolution.ts` and `src/review-parser.ts`
- [x] T046 [US6] Refresh comments pane state and navigation after resolve actions in `src/comments-view.ts` and `src/main.ts`

**Checkpoint**: User Story 6 is independently functional and testable.

---

## Phase 9: User Story 7 - Save and Switch Review Themes (Priority: P7)

**Goal**: Save, switch, overwrite, and delete named theme presets with persistence.

**Independent Test**: Save/select/delete/overwrite presets and verify persistence across restart.

### Tests for User Story 7

- [x] T047 [P] [US7] Add unit tests for preset naming, overwrite, and built-in delete guards in `tests/unit/theme-presets.unit.test.ts`
- [x] T048 [P] [US7] Add integration tests for theme preset persistence and switching in `tests/integration/us7-theme-presets.integration.test.ts`

### Implementation for User Story 7

- [x] T049 [US7] Implement theme preset registry CRUD and case-insensitive lookup in `src/theme-presets.ts`
- [x] T050 [US7] Extend settings UI for save/select/delete/overwrite preset flows in `src/review-config.ts`
- [x] T051 [US7] Apply active preset colors to live preview and reading view pipelines in `src/live-preview.ts` and `src/reading-view.ts`
- [x] T052 [US7] Persist and restore preset registry and active preset in plugin settings lifecycle in `src/main.ts` and `src/review-types.ts`

**Checkpoint**: User Story 7 is independently functional and testable.

---

## Phase 10: Polish and Cross-Cutting Concerns

**Purpose**: Stabilization, documentation, and full regression/quality validation.

- [x] T053 [P] Update baseline Phase 2 feature documentation and user-facing behavior notes (US1-US7 scope before addendum) in `README.md` and `docs/obsidian-review-plugin-prd-phase-2.md`
- [x] T054 [P] Add regression coverage updates for existing rendering/comment behavior in `tests/unit/live-preview.unit.test.ts`, `tests/unit/comments-view.unit.test.ts`, and `tests/integration/us3-rendering.integration.test.ts`
- [x] T055 Run full quality gates and address failures via project scripts in `package.json` (`npm run check`, `npm run lint`, `npm run format:check`, `npm test`)
- [x] T056 Run and record manual validation checklist completion, including SC-001 timed protocol steps, in `specs/002-track-changes-workflow/quickstart.md`
- [x] T057 [P] Add a no-network-usage guard test for Phase 2 modules (no telemetry/external transfer) in `tests/unit/no-network-usage.unit.test.ts`

---

## Phase 11: Structural Markdown Safety and Substitution Rendering Addendum (2026-04-21)

**Purpose**: Incorporate the decision record [design-decision-markdown-structure-handling-2026-04-21.md](./design-decision-markdown-structure-handling-2026-04-21.md) into this existing feature branch without creating a new branch.

### Tests for Addendum

- [ ] T058 [P] [US1] Add unit tests for syntax-sensitive edit classification and safe bypass boundaries in `tests/unit/track-changes.unit.test.ts`
- [ ] T059 [P] [US1] Add integration tests for mixed Markdown fixtures (headings/lists/callouts/fenced code/links/footnotes) with whole-transaction bypass and no cross-region mutation checks in `tests/integration/us1-track-changes.integration.test.ts`
- [ ] T060 [P] [US2] Add rendering regression tests for active substitution old/new visual split and strike-through scope in `tests/unit/live-preview.unit.test.ts` and `tests/integration/us3-rendering.integration.test.ts`
- [ ] T061 [P] [US5] Add pane regression tests confirming bypassed syntax-sensitive edits are excluded from changes list in `tests/unit/changes-view.unit.test.ts` and `tests/integration/us5-changes-pane.integration.test.ts`
- [ ] T062 [P] [US4] Add quick-action tests for protected syntax-sensitive selection no-op + notice behavior in `tests/unit/quick-actions-view.unit.test.ts` and `tests/integration/us4-quick-actions-pane.integration.test.ts`
- [ ] T063 [P] [US1] Add runtime notice tests ensuring first-bypass-per-session notice semantics in `tests/unit/track-changes.unit.test.ts` and `tests/integration/us1-track-changes.integration.test.ts`
- [ ] T064 [P] [US2] Add accepted-text structural projection tests for headings/lists/callouts/fenced-code-like tracked content in `tests/unit/reading-view.unit.test.ts` and `tests/integration/us2-accepted-text-view.integration.test.ts`

### Implementation for Addendum

- [ ] T065 [US1] Implement syntax-sensitive edit classifier and safe bypass policy while preserving stable table behavior in `src/track-changes.ts`
- [ ] T066 [US1] Implement first-bypass-per-session non-blocking notice behavior in `src/main.ts` and `src/track-changes.ts`
- [ ] T067 [US5] Enforce changes-pane listing scope to tracked additions/deletions/substitutions only (exclude bypassed edits) in `src/review-parser.ts` and `src/changes-view.ts`
- [ ] T068 [US4] Implement protected-selection quick-action no-op and notice handling in `src/review-commands.ts` and `src/main.ts`
- [ ] T069 [US2] Refine substitution live-preview decorations for active-token rendering parity in `src/live-preview.ts` and `styles.css`
- [ ] T070 [US2] Implement accepted-text structural markdown projection rendering while preserving source markup in `src/reading-view.ts`, `src/live-preview.ts`, and `src/display-mode.ts`
- [ ] T071 Run full quality gates and update manual validation record for addendum scenarios in `specs/002-track-changes-workflow/quickstart.md`
- [ ] T072 [US2] Verify accepted-text projection implementation against SC-011 fixtures and record outcomes in `specs/002-track-changes-workflow/quickstart.md`

### Validation and Documentation for Addendum

- [ ] T073 [P] [US1] Add randomized edit-sequence invariant tests for mixed markdown safety (no out-of-range positions, no unsorted decoration ranges, no cross-region mutation) in `tests/integration/us1-randomized-invariants.integration.test.ts`
- [ ] T074 Update README with addendum-only behavior deltas (structural markdown safety, bypass UX notice semantics, protected-selection quick-action behavior, and notice-key contract) in `README.md`

**Checkpoint**: Structural markdown safety behavior, protected quick-action behavior, one-time bypass notice semantics, changes-pane exclusion semantics, and accepted-text structural projection are validated without regressing current table handling.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1. Blocks all user stories.
- **User Story Phases (3-9)**: Depend on Phase 2 completion.
- **Polish (Phase 10)**: Depends on completion of all targeted user stories.
- **Addendum (Phase 11)**: Depends on stabilized baseline from Phases 3-10; may be delivered incrementally by story slices (US1/US2/US4/US5).

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational phase.
- **US2 (P2)**: Depends on US1 track-mode plumbing plus Foundational phase.
- **US3 (P3)**: Depends on US1 token generation and parser metadata.
- **US4 (P4)**: Depends on Foundational command/editor helpers.
- **US5 (P5)**: Depends on US3 resolution commands and parser metadata.
- **US6 (P6)**: Depends on existing comments parsing plus US3 transform helpers.
- **US7 (P7)**: Depends only on Foundational settings persistence.

### Recommended Delivery Order

1. US1 (MVP core)
2. US3 (resolution workflow)
3. US2 (accepted-text display)
4. US4 (quick actions)
5. US5 (changes pane)
6. US6 (comment cleanup)
7. US7 (theme presets)

---

## Parallel Execution Examples

### User Story 1

```text
Run in parallel:
- T011 [US1] tests/unit/track-changes.unit.test.ts
- T012 [US1] tests/integration/us1-track-changes.integration.test.ts
- T013 [US1] tests/perf/us1-track-typing-latency.perf.test.ts
```

### User Story 2

```text
Run in parallel:
- T018 [US2] tests/unit/display-mode.unit.test.ts
- T019 [US2] tests/integration/us2-accepted-text-view.integration.test.ts
```

### User Story 3

```text
Run in parallel:
- T024 [US3] tests/unit/change-resolution.unit.test.ts
- T025 [US3] tests/integration/us3-change-resolution.integration.test.ts
- T026 [US3] tests/perf/us3-accept-all-latency.perf.test.ts
```

### User Story 4

```text
Run in parallel:
- T030 [US4] tests/unit/quick-actions-view.unit.test.ts
- T031 [US4] tests/integration/us4-quick-actions-pane.integration.test.ts
```

### User Story 5

```text
Run in parallel:
- T036 [US5] tests/unit/changes-view.unit.test.ts
- T037 [US5] tests/integration/us5-changes-pane.integration.test.ts
```

### User Story 6

```text
Run in parallel:
- T042 [US6] tests/unit/comments-view-resolve.unit.test.ts
- T043 [US6] tests/integration/us6-comments-resolve.integration.test.ts
```

### User Story 7

```text
Run in parallel:
- T047 [US7] tests/unit/theme-presets.unit.test.ts
- T048 [US7] tests/integration/us7-theme-presets.integration.test.ts
```

### Addendum (Phase 11)

```text
Run in parallel:
- T058 [US1] tests/unit/track-changes.unit.test.ts
- T061 [US5] tests/unit/changes-view.unit.test.ts + tests/integration/us5-changes-pane.integration.test.ts
- T062 [US4] tests/unit/quick-actions-view.unit.test.ts + tests/integration/us4-quick-actions-pane.integration.test.ts
- T064 [US2] tests/unit/reading-view.unit.test.ts + tests/integration/us2-accepted-text-view.integration.test.ts
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate US1 independently with T011-T017.

### Incremental Delivery

1. Deliver US1 for automatic tracking.
2. Deliver US3 to resolve tracked edits safely.
3. Deliver US2/US4/US5 to improve review throughput.
4. Deliver US6/US7 as workflow and settings enhancements.
5. Finish with Phase 10 regression and docs.

### Parallel Team Strategy

1. One developer completes Phase 1-2 with review support.
2. After foundation, split owners by story phase with disjoint files.
3. Merge each story only after its independent tests pass.

---

## Notes

- [P] tasks are safe to run in parallel because they target separate files.
- Keep story scope isolated; do not mix unresolved work across user stories.
- Preserve deterministic transforms and undo safety as non-negotiable quality bars.
