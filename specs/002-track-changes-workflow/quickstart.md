# Quickstart: Track Changes Workflow (Phase 2)

Decision baseline: [design-decision-markdown-structure-handling-2026-04-21.md](./design-decision-markdown-structure-handling-2026-04-21.md)

## Prerequisites

- Node.js 22.x
- npm
- Obsidian vault for manual validation

## 1. Install and build

```powershell
npm install
npm run build
```

## 2. Run quality gates

```powershell
npm run check
npm run lint
npm run format:check
npm test
```

## 3. Deploy to local vault

```powershell
npm run deploy -- "D:\Path\To\Vault"
```

Plugin target path:

`<Vault>/.obsidian/plugins/review-critic`

## 4. Manual feature validation matrix

Validate in this order:

1. Toggle Track Changes Mode on/off.
2. Insert text with no selection -> addition created.
3. Continue typing in same addition -> same addition extends.
4. Insert adjacent to addition -> additions merge when no original text boundary exists.
5. Delete adjacent original text repeatedly -> one merged deletion token.
6. Replace selected text -> substitution token.
7. Switch accepted-text display:
   - additions visible as normal text
   - deletions hidden
   - substitutions show replacement text
   - comments remain visible
8. Resolve single changes (accept and reject) from changes pane.
9. Accept all changes from changes pane.
10. Quick actions:
    - Add with no selection inserts `{++ ++}` and cursor inside
    - Comment with no selection inserts empty comment
    - Delete/Highlight/Replace with no selection are safe no-op
11. Comment pane resolve/remove actions for standalone and anchored comments.
12. Theme presets:
    - save preset
    - switch preset
    - duplicate name prompts overwrite/rename
    - delete custom preset
    - built-in preset cannot be deleted
    - restart Obsidian and confirm persistence
13. Structural/syntax-sensitive markdown safety checks in Track Changes mode:
    - table edits remain stable and do not produce unintended tracked transforms
    - heading/list/callout/fenced-code/separator/link/footnote edits do not corrupt unrelated content
    - when safe tracked representation is unavailable, edits are preserved via safe bypass
    - bypassed structural edits are not listed in the changes pane
    - first bypass in session shows one non-blocking notice; subsequent bypasses do not repeatedly notify
    - mixed selections (inline + syntax-sensitive) bypass tracked transformation for the full transaction
14. Quick-action safety checks on protected selections:
    - Add/Delete/Highlight/Replace on syntax-sensitive selections are no-op
    - user receives clear non-blocking protected-selection notice
    - content remains unchanged
15. Substitution rendering checks:
    - in markup-aware mode, old and new substitution parts remain visually distinct
    - while cursor is inside substitution, strike-through applies only to old side
    - no range/decoration runtime errors are produced during substitution edits
16. Accepted-text structural projection checks:
    - tracked content that resolves to headings/lists/callouts/code-like blocks renders with normal markdown structure
    - source markup in note remains unchanged while toggling accepted-text mode

### SC-001 timed protocol

Run this as a deterministic internal usability check:

1. Open `tests/fixtures/track-changes-phase2.md` in Obsidian.
2. Start a timer.
3. Enable Track Changes Mode.
4. Create one addition (no selection typing), one deletion, and one substitution.
5. Stop the timer when all three are present as markup.
6. Pass criterion: completed in under 2 minutes.

## 5. Regression checks

- Existing reading view rendering still works.
- Existing live preview decoration still works.
- Existing comment parsing and navigation still work.
- No performance regression during normal typing in common notes.
- Structural/syntax-sensitive edits remain non-corrupting under Track Changes mode.

## 6. Validation record

- Date: 2026-04-21
- Build/type check: pass
- Lint: pass
- Format check: fail (pre-existing repo-wide formatting drift in `.review/*` and archival/spec markdown files)
- Automated tests: pass (unit/integration/perf)
- Addendum verification:
  - SC-011 accepted-text structural projection fixtures: pass (`tests/unit/reading-view.unit.test.ts`, `tests/integration/us2-accepted-text-view.integration.test.ts`, `tests/unit/display-mode.unit.test.ts`)
  - Mixed-markdown randomized invariants: pass (`tests/integration/us1-randomized-invariants.integration.test.ts`)
  - Protected-selection + bypass notice semantics: pass (`tests/unit/track-changes.unit.test.ts`, `tests/integration/us4-quick-actions-pane.integration.test.ts`)
- Manual checklist: pending final human verification in Obsidian UI
