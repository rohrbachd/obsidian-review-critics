# Tasks: Obsidian Bot Remediation

**Input**: Design documents from `/specs/003-obsidian-bot-remediation/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are in scope for this feature. Run `npm run lint`, `npm run test:unit`, `npm test`, and `npm run build`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Single project paths under `src/`, `tests/`, `docs/`, and `specs/`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare compliance-gate tooling and planning artifacts.

- [ ] T001 Add and configure official Obsidian lint plugin in `.eslintrc.cjs` and `package.json`
- [ ] T002 [P] Align feature docs baseline in `specs/003-obsidian-bot-remediation/plan.md`, `specs/003-obsidian-bot-remediation/research.md`, and `docs/obsidian_bot_checks_26-04-22.md`
- [ ] T003 [P] Validate plan artifacts and contract consistency in `specs/003-obsidian-bot-remediation/data-model.md` and `specs/003-obsidian-bot-remediation/contracts/compliance-gate.openapi.yaml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish blocking compliance gate and shared guard infrastructure used by all stories.

**WARNING**: No user story work can begin until this phase is complete.

- [ ] T004 Implement repository-wide compliance guard harness for `src/**/*.ts` in `tests/unit/obsidian-bot-compliance.unit.test.ts`
- [ ] T005 [P] Add allowlist/waiver validation and rationale checks in `tests/unit/obsidian-bot-compliance.unit.test.ts`
- [ ] T006 [P] Update lint/test execution guidance and blocking policy in `specs/003-obsidian-bot-remediation/quickstart.md`

**Checkpoint**: Foundation ready; user stories can be implemented independently.

---

## Phase 3: User Story 1 - Remove Required Bot Findings (Priority: P1)

**Goal**: Eliminate all currently reported required ObsidianReviewBot code findings.

**Independent Test**: `npm run lint && npm test` passes and targeted checks show no flagged patterns remain in source.

### Tests for User Story 1

- [ ] T007 [P] [US1] Add lifecycle and promise-handling assertions to `tests/unit/obsidian-bot-compliance.unit.test.ts`
- [ ] T008 [P] [US1] Update renderer behavior assertions for class-based styling in `tests/unit/reading-view.unit.test.ts` and `tests/integration/us3-rendering.integration.test.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Remove unnecessary async `onOpen/onClose` signatures in `src/changes-view.ts`, `src/comments-view.ts`, and `src/quick-actions-view.ts`
- [ ] T010 [US1] Correct async callback usage and awaited leaf reveal handling in `src/main.ts`
- [ ] T011 [US1] Preserve pane placement by removing leaf detachment behavior in `src/main.ts`
- [ ] T012 [US1] Replace settings heading elements with `Setting(...).setHeading()` patterns in `src/main.ts`
- [ ] T013 [US1] Replace direct inline token style assignments with CSS-class-based rendering in `src/reading-view.ts`
- [ ] T014 [US1] Add supporting CSS class for reading token heading layout in `styles.css`
- [ ] T015 [US1] Update tracked remediation statuses and source links in `docs/obsidian_bot_checks_26-04-22.md`

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Prevent Future Submission Regressions (Priority: P2)

**Goal**: Enforce a blocking combined compliance gate (official lint + local guards) for future changes.

**Independent Test**: Intentionally reintroducing a prohibited pattern in any `src/**/*.ts` file fails CI-local gate (`lint` and/or compliance unit tests).

### Tests for User Story 2

- [ ] T016 [P] [US2] Add full-scope `src/**/*.ts` guard assertions and allowlist behavior tests in `tests/unit/obsidian-bot-compliance.unit.test.ts`
- [ ] T017 [P] [US2] Add a negative-path regression test case proving blocking failure behavior in `tests/unit/obsidian-bot-compliance.unit.test.ts`

### Implementation for User Story 2

- [ ] T018 [US2] Enable Obsidian lint rules as blocking checks in `.eslintrc.cjs` and `package.json`
- [ ] T019 [US2] Normalize compliance gate rules/terminology in `specs/003-obsidian-bot-remediation/spec.md` and `specs/003-obsidian-bot-remediation/quickstart.md`
- [ ] T020 [US2] Update canonical compliance entities and gate semantics in `docs/data-model.md` and `specs/003-obsidian-bot-remediation/data-model.md`

**Checkpoint**: User Story 2 is fully functional and independently testable.

---

## Phase 5: Polish and Cross-Cutting Concerns

**Purpose**: Final validation and release-readiness confirmation across stories.

- [ ] T021 [P] Run full validation suite (`npm run lint`, `npm test`, `npm run build`) and record outcomes in `specs/003-obsidian-bot-remediation/quickstart.md`
- [ ] T022 [P] Verify AGENTS context consistency after changes in `AGENTS.md`
- [ ] T023 Prepare release-readiness summary and reviewer-facing notes in `docs/Obsidian Publication Guide.md`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: no dependencies.
- **Phase 2 (Foundational)**: depends on Phase 1 and blocks all user story work.
- **Phase 3 (US1)**: depends on Phase 2.
- **Phase 4 (US2)**: depends on Phase 2; can run after US1 or in parallel where no file conflicts exist.
- **Phase 5 (Polish)**: depends on completion of targeted user stories.

### User Story Dependencies

- **US1 (P1)**: independent after Foundational; provides direct remediation value.
- **US2 (P2)**: independent after Foundational; can build on US1 test updates but remains independently testable.

### Within Each User Story

- Add/update tests before finalizing implementation changes.
- Source changes before documentation/status finalization.
- Story must pass its independent test before moving on.

### Parallel Opportunities

- Setup: `T002` and `T003` can run in parallel.
- Foundational: `T005` and `T006` can run in parallel after `T004`.
- US1: `T007` and `T008` parallel; then `T009`/`T013` can proceed in parallel (different files).
- US2: `T016` and `T017` parallel; then `T018` and `T020` can run in parallel.
- Polish: `T021` and `T022` parallel.

---

## Parallel Example: User Story 1

```bash
# Parallel test updates
Task: "T007 [US1] lifecycle/promise assertions in tests/unit/obsidian-bot-compliance.unit.test.ts"
Task: "T008 [US1] rendering assertions in tests/unit/reading-view.unit.test.ts and tests/integration/us3-rendering.integration.test.ts"

# Parallel implementation on separate files
Task: "T009 [US1] lifecycle signatures in src/changes-view.ts, src/comments-view.ts, src/quick-actions-view.ts"
Task: "T013 [US1] class-based token styling in src/reading-view.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate with `npm run lint && npm test`.
4. Stop and verify all required current bot findings are resolved.

### Incremental Delivery

1. Deliver US1 remediation first (submission unblocking value).
2. Deliver US2 hardening next (future regression prevention).
3. Complete Polish phase and readiness documentation.

### Parallel Team Strategy

1. One developer handles lint/config and gate foundation (`T001-T006`).
2. One developer handles US1 source remediation (`T009-T015`).
3. One developer handles US2 guard hardening/docs (`T016-T020`).

---

## Notes

- `[P]` tasks are safe parallel candidates only when files do not overlap.
- `[US1]` and `[US2]` labels provide traceability to spec priorities.
- Compliance gate is explicitly blocking per clarified requirement.
- Keep allowlist exceptions minimal and documented with rationale.
