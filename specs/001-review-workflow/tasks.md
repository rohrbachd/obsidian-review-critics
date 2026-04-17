# Tasks: Obsidian Review Workflow v1

**Input**: Design documents from `/specs/001-review-workflow/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: Parser, integration, performance, and CI-runnable validation tests are in scope.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, quality tooling, and CI baseline

- [x] T001 Create test and metrics directories in `tests/unit/.gitkeep`, `tests/integration/.gitkeep`, `tests/perf/.gitkeep`, and `artifacts/metrics/.gitkeep`
- [x] T002 Add lint/format/test scripts to `package.json` (`lint`, `lint:fix`, `format`, `format:check`, `test:unit`, `test:integration`, `test:perf`, `test`)
- [x] T003 [P] Add ESLint config for TypeScript project in `.eslintrc.cjs`
- [x] T004 [P] Add Prettier config and ignore rules in `.prettierrc` and `.prettierignore`
- [x] T005 [P] Add fixture note covering all syntax forms in `tests/fixtures/review-syntax.md`
- [x] T006 [P] Add fixture note for malformed/nested/code-fence scenarios in `tests/fixtures/review-edge-cases.md`
- [x] T007 Add CI workflow to run build, lint/format checks, and tests in `.github/workflows/ci.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared parser/model/test foundation required by all user stories

**WARNING**: No user story work can begin until this phase is complete

- [x] T008 Add shared review syntax/constants module in `src/review-constants.ts`
- [x] T009 [P] Normalize canonical type exports in `src/review-types.ts` to match `docs/data-model.md`
- [x] T010 Refactor token extraction and fence exclusion to use shared constants in `src/review-parser.ts`
- [x] T011 [P] Add unit test runner setup in `vitest.config.ts` and `tsconfig.json`
- [x] T012 [P] Add parser unit test harness in `tests/unit/review-parser.test.ts`
- [x] T013 Implement parser tests for addition/deletion/substitution/highlight/comment parsing in `tests/unit/review-parser.test.ts`
- [x] T014 Implement parser tests for anchored adjacency, multiline handling, and nested-token plain-text policy in `tests/unit/review-parser.test.ts`
- [x] T015 Implement parser tests for code-fence exclusion and malformed token pass-through in `tests/unit/review-parser.test.ts`
- [x] T016 Update local command contract to include pane open/focus operation in `specs/001-review-workflow/contracts/openapi.yaml`
- [x] T049 [P] Add unit test suite for plugin command/settings lifecycle in `tests/unit/main.unit.test.ts`
- [x] T050 [P] Add unit test suite for reading-view rendering helpers in `tests/unit/reading-view.unit.test.ts`
- [x] T051 [P] Add unit test suite for live-preview decoration behavior in `tests/unit/live-preview.unit.test.ts`
- [x] T052 [P] Add unit test suite for comments pane view behavior in `tests/unit/comments-view.unit.test.ts`
- [x] T053 [P] Add unit test suite for shared constants invariants in `tests/unit/review-constants.unit.test.ts`
- [x] T054 [P] Add unit test suite for review type contracts in `tests/unit/review-types.unit.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and Anchor Feedback (Priority: P1)

**Goal**: Users can insert standalone comments and anchored comments from selected text with predictable markup output.

**Independent Test**: Running command palette actions inserts expected tokens and blocks empty-selection anchored command.

### Tests for User Story 1

- [x] T017 [P] [US1] Add executable command behavior tests in `tests/integration/us1-commands.integration.test.ts`
- [x] T055 [P] [US1] Add timed action benchmark for SC-001 in `tests/perf/us1-comment-action-latency.perf.test.ts`

### Implementation for User Story 1

- [x] T018 [US1] Implement standalone comment insertion behavior in `src/main.ts`
- [x] T019 [US1] Implement anchored comment insertion on non-empty selection in `src/main.ts`
- [x] T020 [US1] Implement mark-as-addition and mark-as-deletion commands in `src/main.ts`
- [x] T021 [US1] Implement mark-as-substitution command with empty-selection guard in `src/main.ts`
- [x] T022 [US1] Ensure author metadata prefill is applied consistently for comment insertion paths in `src/main.ts`
- [x] T056 [US1] Persist SC-001 action latency metrics output in `artifacts/metrics/sc001-command-latency.json`

**Checkpoint**: User Story 1 is independently functional and testable

---

## Phase 4: User Story 2 - Review and Navigate Comments (Priority: P1)

**Goal**: Users can open a current-note comments pane, inspect parsed entries, and navigate to source positions.

**Independent Test**: Pane lists comments for active note and clicking any entry moves cursor to intended location.

### Tests for User Story 2

- [x] T023 [P] [US2] Add unit tests for comment entry generation in `tests/unit/comment-pane-entries.test.ts`
- [x] T024 [P] [US2] Add executable pane open/empty-state/navigation tests in `tests/integration/us2-pane-navigation.integration.test.ts`
- [x] T025 [P] [US2] Add navigation accuracy measurement test for SC-003 in `tests/integration/us2-navigation-accuracy.integration.test.ts`

### Implementation for User Story 2

- [x] T026 [US2] Implement or refine `CommentPaneEntry` generation logic for active note in `src/review-parser.ts`
- [x] T027 [US2] Implement comments pane empty/list states and item rendering in `src/comments-view.ts`
- [x] T028 [US2] Implement pane open/focus command and leaf activation flow in `src/main.ts`
- [x] T029 [US2] Implement click-to-navigate behavior with markdown-leaf fallback in `src/main.ts`
- [x] T030 [US2] Implement active-note/pane refresh triggers (`file-open`, `modify`, active leaf) in `src/main.ts`
- [x] T031 [US2] Persist SC-003 navigation metrics output in `artifacts/metrics/sc003-navigation-accuracy.json`

**Checkpoint**: User Story 2 is independently functional and testable

---

## Phase 5: User Story 3 - Readable Rendering During Review (Priority: P2)

**Goal**: Reading view and Live Preview provide distinct, editable visual treatment for supported review syntax.

**Independent Test**: Fixture note renders all token types distinctly in Reading and Live Preview without blocking edits.

### Tests for User Story 3

- [x] T032 [P] [US3] Add executable rendering behavior tests in `tests/integration/us3-rendering.integration.test.ts`
- [x] T033 [P] [US3] Add pane refresh performance benchmark for SC-002 in `tests/perf/us3-pane-refresh.perf.test.ts`
- [x] T034 [P] [US3] Add token-type distinguishability test for SC-004 in `tests/integration/us3-token-distinguishability.integration.test.ts`

### Implementation for User Story 3

- [x] T035 [US3] Implement reading-view token replacement/decorations with code/pre exclusion in `src/reading-view.ts`
- [x] T036 [US3] Implement anchored-comment visual pairing in reading view output in `src/reading-view.ts`
- [x] T037 [US3] Implement Live Preview decoration plugin with per-token classes in `src/live-preview.ts`
- [x] T038 [US3] Ensure multiline, orphan, and nested-token policies are preserved in rendering flows in `src/reading-view.ts` and `src/live-preview.ts`
- [x] T039 [US3] Add and tune CSS classes for reading/live token visibility and anchored cues in `styles.css`
- [x] T040 [US3] Persist SC-002 and SC-004 metrics outputs in `artifacts/metrics/sc002-pane-refresh.json` and `artifacts/metrics/sc004-token-distinguishability.json`

**Checkpoint**: User Story 3 is independently functional and testable

---

## Phase 6: User Story 4 - Persistent Personalization (Priority: P3)

**Goal**: Users can persist author and rendering preferences across restarts, including preview/edit color settings.

**Independent Test**: Change settings, restart Obsidian, and verify persisted behavior and command outputs.

### Tests for User Story 4

- [x] T041 [P] [US4] Add executable settings persistence tests in `tests/integration/us4-settings-persistence.integration.test.ts`

### Implementation for User Story 4

- [x] T042 [US4] Implement settings defaults/load/save merge strategy in `src/main.ts`
- [x] T043 [US4] Implement settings tab controls for author/toggles/preview colors/edit colors in `src/main.ts`
- [x] T044 [US4] Implement CSS variable application for persisted color settings in `src/main.ts` and `styles.css`

**Checkpoint**: User Story 4 is independently functional and testable

---

## Phase 7: Polish and Cross-Cutting Concerns

**Purpose**: Final hardening, documentation, and end-to-end verification

- [x] T045 [P] Update user-facing documentation and command list in `README.md`
- [x] T046 [P] Document benchmark profile and measurement procedure in `specs/001-review-workflow/quickstart.md`
- [x] T047 Run full quality gate (`npm run build`, `npm run lint`, `npm run format:check`, `npm run test`) and record outcomes in `artifacts/metrics/final-quality-gate.md`
- [x] T048 Review and clean up duplicated literals/comments for maintainability in `src/main.ts`, `src/review-parser.ts`, and `src/reading-view.ts`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: Depend on Foundational phase completion
- **Polish (Phase 7)**: Depends on completion of all selected user stories

### User Story Dependencies

- **US1**: Starts after Phase 2
- **US2**: Starts after Phase 2 (can run in parallel with US1)
- **US3**: Starts after Phase 2 (can run in parallel with US1/US2)
- **US4**: Starts after Phase 2 (can run in parallel with US1-US3)

### Within Each User Story

- Executable tests before final implementation sign-off
- Data/parsing logic before UI wiring
- UI wiring before metrics capture and story checkpoint

### Parallel Opportunities

- Phase 1 tasks marked [P] can run in parallel
- Phase 2 tasks T009, T011-T015, and T049-T054 can run in parallel after T008
- After Phase 2, US1-US4 can be developed in parallel by separate contributors
- Story-specific executable tests marked [P] can run alongside implementation on separate files

---

## Parallel Example: User Story 1

```bash
Task: "T017 [US1] Add executable command tests in tests/integration/us1-commands.integration.test.ts"
Task: "T022 [US1] Ensure author metadata prefill consistency in src/main.ts"
```

## Parallel Example: User Story 2

```bash
Task: "T023 [US2] Add unit tests in tests/unit/comment-pane-entries.test.ts"
Task: "T027 [US2] Implement pane rendering in src/comments-view.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T033 [US3] Add performance benchmark in tests/perf/us3-pane-refresh.perf.test.ts"
Task: "T039 [US3] Add token styling in styles.css"
```

## Parallel Example: User Story 4

```bash
Task: "T041 [US4] Add settings persistence tests in tests/integration/us4-settings-persistence.integration.test.ts"
Task: "T044 [US4] Apply CSS variables in src/main.ts and styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate US1 independently before expanding scope

### Incremental Delivery

1. Setup + Foundation establishes stable parser/model base and CI quality gates
2. Deliver US1 and US2 as highest-value review workflow increment
3. Deliver US3 rendering refinements with measurable SC-002/SC-004 evidence
4. Deliver US4 persistence/personalization
5. Execute polish and final quality gates

### Parallel Team Strategy

1. Team completes Phase 1-2 together
2. Assign one contributor per story phase (US1-US4)
3. Merge each story after executable test and metrics checkpoint

---

## Notes

- [P] tasks are intentionally scoped to separate files to reduce merge conflicts
- [US#] labels provide direct traceability to spec user stories
- Each story phase has a standalone independent test criterion
- Prefer small commits per task or coherent task bundle
