# Quickstart: Track Changes Workflow (Phase 2)

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

## 5. Regression checks

- Existing reading view rendering still works.
- Existing live preview decoration still works.
- Existing comment parsing and navigation still work.
- No performance regression during normal typing in common notes.
