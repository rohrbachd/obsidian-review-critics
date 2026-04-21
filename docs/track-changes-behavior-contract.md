# Track Changes Behavior Contract (As-Built)

This document defines the **implemented behavior contract** for Track Changes, change resolution, accepted view, quick actions, and theme preset handling in this plugin.

Purpose:
- Capture hard-won behavioral rules and edge-case decisions in one stable place.
- Provide a shared reference for future fixes/refactors.
- Act as implementation requirements for regression testing.

Scope:
- Runtime behavior currently implemented in `src/track-changes.ts`, `src/main.ts`, `src/change-resolution.ts`, `src/changes-view.ts`, `src/comments-view.ts`, `src/live-preview.ts`, `src/reading-view.ts`, and related tests.

Non-goal:
- This is not a product PRD; it is an as-built engineering contract.

## 1) Core Invariants

1. Critic token delimiters are structural and must not be editable in Track Changes mode:
   - `{++`, `++}`
   - `{--`, `--}`
   - `{~~`, `~>`, `~~}`
   - `{>>`, `<<}`
2. Track Changes must never silently corrupt content structure.
3. Syntax-sensitive Markdown edits are safety-protected and may bypass auto-tracking.
4. Bypassed syntax-sensitive edits are not added as tracked entries in the Changes pane.
5. Accept/Reject/Resolve actions are single-flight and must not execute concurrently from repeated clicks.

## 2) Token Semantics

1. Addition: `{++text++}`
2. Deletion: `{--text--}`
3. Substitution: `{~~old~>new~~}`
4. Highlight: `{==text==}`
5. Comment: `{>> [author=Name] comment <<}` or `{>> comment <<}`
6. Anchored comment: `{==text==}{>> ... <<}`

## 3) Track Changes Transform Rules

All rules below apply when Track Changes mode is ON.

### 3.1 Insert typing (`from === to`, inserted text non-empty)

1. Inside token delimiter: block edit.
2. Inside substitution old side: block edit.
3. Inside comment body: insert plain text (no new Critic token).
4. Inside substitution new side: insert plain text into new side.
5. Inside addition body: insert plain text into addition.
6. Inside deletion body:
   - Split deletion around cursor.
   - Insert typed text as a new addition between split deletion segments.
7. Anywhere else:
   - Wrap inserted text as addition.
   - Merge adjacent additions.

### 3.2 Replace selection (`from !== to`, inserted text non-empty)

1. If selection overlaps any token delimiter: block edit.
2. If selection is fully inside same comment body: replace as plain text.
3. If selection is fully inside same addition body: replace as plain text.
4. If selection is fully inside same substitution new side: replace as plain text.
5. If selection is fully inside same substitution old side: block edit.
6. If selected text is whitespace-only: create addition for inserted text.
7. Otherwise: create substitution `{~~selected~>inserted~~}`.

### 3.3 Delete selection (`from !== to`, inserted text empty)

1. If selection overlaps token delimiter: block edit.
2. If selection is fully inside same comment body: plain delete.
3. If selection is fully inside same addition body:
   - Plain delete.
   - If addition body becomes empty, remove entire addition token.
4. If selection is fully inside same substitution new side: plain delete in new side.
5. If selection is fully inside substitution old side: block edit.
6. If selection is fully inside deletion body: block edit.
7. Otherwise:
   - Wrap deleted text as deletion token.
   - Merge adjacent deletions.

## 4) Safety Bypass Rules (No Auto-Tracking)

When any of the following are detected, auto-tracking is skipped and the underlying editor change proceeds as-is:

1. Markdown table context.
2. Fenced code or math context (``` / ~~~ / `$$` fences).
3. Block quote or callout lines (`>` including `[!NOTE]` style callouts).
4. Footnote definition lines (`[^id]:`).
5. Inline structural markdown ranges:
   - links/images `[text](url)` and `![alt](url)`
   - wiki links `[[...]]`
   - inline footnote refs `[^id]`
6. Newline insertion at start of structural lines (headings/lists/tasks/callouts/tables/rules/fences).
7. Markdown strikethrough format toggle operations (`~~text~~` <-> `text`).
8. Structured multi-line/table-like replacement operations (newline/pipe sensitive edits).

User notice behavior:
1. Track Changes bypass notice is shown at most once per session:
   - `review.trackChanges.protectedBypass`
2. Quick actions on protected selections show:
   - `review.quickAction.protectedSelection`

## 5) Quick Action Contract

Quick actions: `Add`, `Delete`, `Highlight`, `Replace`, `Comment`.

No selection behavior:
1. Add inserts empty addition and places cursor inside.
2. Comment inserts empty comment (with configured author if available).
3. Delete/Highlight/Replace leave content unchanged.

Selection behavior:
1. Add/Delete/Highlight/Replace apply corresponding wrappers.
2. Comment inserts anchored comment markup.
3. If selection is syntax-sensitive and action is Add/Delete/Highlight/Replace:
   - no content modification
   - protected-selection notice is shown.

## 6) Accepted View Contract

Accepted View must be projection-only (no source mutation).

Projection rules:
1. Addition -> visible text.
2. Deletion -> hidden.
3. Substitution -> replacement side only.
4. Comments remain visible.

UI behavior:
1. Toggle preserves source markup.
2. Exiting accepted view restores markup-aware display.

## 7) Substitution Rendering Contract

In markup-aware rendering:
1. Old and new sides are visually distinct.
2. Strike-through applies only to old side.
3. New side is not globally forced bold.
4. Wrapper-only markdown in substitution new side is rendered without marker literals:
   - `**text**` -> bold text
   - `*text*` -> italic text
   - `***text***` -> bold+italic text
   - `~~text~~` -> struck text

## 8) Change Resolution Contract

Single change resolve mapping:
1. Addition:
   - Accept -> keep text.
   - Reject -> remove text.
2. Deletion:
   - Accept -> remove deleted text.
   - Reject -> restore original text.
3. Substitution:
   - Accept -> keep replacement text.
   - Reject -> keep original text.

Accept All:
1. Resolve all additions/deletions/substitutions in current note as accepted.

Comment resolve:
1. Standalone comment resolve removes comment token.
2. Anchored comment resolve removes comment part and keeps highlighted text readable.

## 9) Command Concurrency and UI Guardrails

1. Review commands run under a global single-flight lock.
2. If a command is in-flight, additional commands are rejected with notice.
3. Per-entry Accept/Reject/Resolve buttons are disabled while pending.
4. `Accept All` button is disabled while running.
5. Pane actions prevent duplicate execution from rapid repeated clicks.

## 10) Theme Preset Contract

1. Users can save current color config as named preset.
2. Save supports overwrite behavior.
3. Duplicate name without overwrite raises duplicate notice.
4. Preset activation applies preset colors immediately and persists.
5. Built-in presets cannot be deleted.
6. Deleting active preset falls back to an available preset and persists.

## 11) Test Coverage Mapping (Primary)

Primary suites enforcing this contract:
1. `tests/unit/track-changes.unit.test.ts`
2. `tests/integration/us1-track-changes.integration.test.ts`
3. `tests/integration/us1-randomized-invariants.integration.test.ts`
4. `tests/integration/us2-accepted-text-view.integration.test.ts`
5. `tests/integration/us3-change-resolution.integration.test.ts`
6. `tests/integration/us3-rendering.integration.test.ts`
7. `tests/integration/us4-quick-actions-pane.integration.test.ts`
8. `tests/integration/us5-changes-pane.integration.test.ts`
9. `tests/integration/us6-comments-resolve.integration.test.ts`
10. `tests/integration/us7-theme-presets.integration.test.ts`

## 12) Maintenance Rule

Any behavior change in Track Changes, Accepted View, rendering, quick actions, resolve workflows, or presets must:
1. Update this contract.
2. Update the corresponding spec/tasks artifacts in `specs/002-track-changes-workflow/` when scope/requirements change.
3. Add or update tests before merge.
