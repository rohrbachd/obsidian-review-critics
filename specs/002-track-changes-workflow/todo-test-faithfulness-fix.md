# TODO Fix: Test Faithfulness Hardening (Spec 002)

## Context

Current automated tests are broad but not fully faithful end-to-end. Most "integration" tests exercise parser/services in isolation with mocked Obsidian runtime, so critical UI/runtime paths are not validated in a real vault session.

Related docs:

- `specs/002-track-changes-workflow/spec.md`
- `specs/002-track-changes-workflow/tasks.md`
- `docs/obsidian-integration-testing.md`

## Goal

Raise test fidelity so acceptance scenarios for Spec 002 are validated through realistic runtime behavior (commands, panes, editor focus, navigation, persistence, and rendering) instead of mostly isolated transform tests.

## Priority 0: Infrastructure Gaps

- [ ] TF-001 Install and enable coverage provider so coverage gates are runnable.
  - Files: `package.json`, `vitest.config.ts`
  - Action: add `@vitest/coverage-v8` and wire CI/local script to fail on missing coverage output.
  - Done when: `npx vitest run --coverage` succeeds and outputs to `artifacts/coverage`.

- [ ] TF-002 Add test taxonomy rules and naming conventions.
  - Files: `specs/002-track-changes-workflow/tasks.md`, `README.md`
  - Action: define what qualifies as unit vs integration vs e2e in this repo.
  - Done when: docs explicitly prohibit parser-only checks from being labeled as E2E/integration.

## Priority 1: True E2E Harness

- [ ] TF-003 Add a real Obsidian manual-E2E execution checklist tied 1:1 to Spec 002 acceptance scenarios.
  - Files: `specs/002-track-changes-workflow/quickstart.md`
  - Action: expand checklist to include explicit pass/fail evidence capture per user story.
  - Done when: each user story scenario has a deterministic validation step and expected result.

- [ ] TF-004 Add automated desktop E2E harness (headless or scripted desktop UI runner).
  - Files: `tests/e2e/` (new), `package.json`, `docs/obsidian-integration-testing.md`
  - Action: stand up vault fixture bootstrapping + plugin deploy + scenario runner.
  - Done when: at least one end-to-end scenario executes in real Obsidian runtime.

- [ ] TF-005 Add CI profile split: fast (unit/integration) and fidelity (e2e/manual gate artifacts).
  - Files: `.github/workflows/*` (if present), `package.json`
  - Done when: pipeline distinguishes smoke vs fidelity jobs.

## Priority 2: Acceptance Scenario Coverage Repair (Spec 002)

### US1 Track Edits While Typing

- [ ] TF-101 Add editor-transaction integration tests for mode ON/OFF in real command/editor flow.
  - Files: `tests/integration/us1-track-changes.integration.test.ts`, `tests/e2e/us1-track-changes.e2e.test.ts` (new)
  - Missing now: explicit runtime verification for "mode off = no markup" and multi-step edits via active editor.

### US2 Accepted-Text View

- [ ] TF-102 Add view-level tests that validate live preview + reading view transitions using plugin lifecycle.
  - Files: `tests/integration/us2-accepted-text-view.integration.test.ts`, `tests/e2e/us2-display-mode.e2e.test.ts` (new)
  - Missing now: plugin command toggle path and reversibility in runtime surface.

### US3 Accept/Reject/Accept-All

- [ ] TF-103 Add command-path tests for accept/reject-at-cursor and pane action wiring.
  - Files: `tests/integration/us3-change-resolution.integration.test.ts`, `tests/e2e/us3-resolution.e2e.test.ts` (new)
  - Missing now: real command registration + cursor resolution path in `src/main.ts`.

### US4 Quick Actions

- [ ] TF-104 Replace builder-only "integration" checks with pane button -> active editor behavior tests.
  - Files: `tests/integration/us4-quick-actions-pane.integration.test.ts`, `tests/e2e/us4-quick-actions.e2e.test.ts` (new)
  - Missing now: click-handling with focused/unfocused editor and no-editor notice behavior.

### US5 Changes Pane

- [ ] TF-105 Add navigation fidelity test verifying pane item click moves cursor in editor.
  - Files: `tests/integration/us5-changes-pane.integration.test.ts`, `tests/e2e/us5-changes-pane.e2e.test.ts` (new)
  - Missing now: parser mapping is tested, but not actual navigation side-effects.

### US6 Comments Resolve

- [ ] TF-106 Add end-to-end comment resolve test from comments pane controls.
  - Files: `tests/integration/us6-comments-resolve.integration.test.ts`, `tests/e2e/us6-comments-resolve.e2e.test.ts` (new)
  - Missing now: transform tested, pane-button workflow not fully validated at runtime.

### US7 Theme Presets

- [ ] TF-107 Add persistence E2E test with full plugin save/load cycle and app restart simulation.
  - Files: `tests/integration/us7-theme-presets.integration.test.ts`, `tests/e2e/us7-theme-presets.e2e.test.ts` (new)
  - Missing now: synthetic merge helper tests vs true persisted lifecycle.

## Priority 3: Edge Cases From Spec 002 (Currently Under-covered)

- [ ] TF-201 Undo/redo immediately after automatic tracked edit.
- [ ] TF-202 Multiline paste with and without selection in track mode.
- [ ] TF-203 Tracked edits near fenced code blocks and malformed markup boundaries.
- [ ] TF-204 Active file switch while changes/comments pane is open.
- [ ] TF-205 Selection spanning multiple tokens/paragraphs during replace/delete.

Suggested files:

- `tests/integration/us1-track-changes.integration.test.ts`
- `tests/integration/us5-changes-pane.integration.test.ts`
- `tests/e2e/us1-edge-cases.e2e.test.ts` (new)

## Completion Criteria

- [ ] CC-001 Every acceptance scenario in `specs/002-track-changes-workflow/spec.md` maps to at least one runtime-faithful test.
- [ ] CC-002 Coverage command works and reports artifacts.
- [ ] CC-003 At least one automated E2E test per user story (US1-US7).
- [ ] CC-004 Manual validation checklist produces versioned evidence (date, vault, plugin version, pass/fail).

## Notes

- Keep existing unit tests; they are valuable for transform correctness and speed.
- Reclassify misleading "integration" tests if they remain parser/service-only.
