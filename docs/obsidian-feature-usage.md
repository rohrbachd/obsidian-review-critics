# Feature Activation and Usage Guide

This guide explains what each feature does and how to activate/use it in Obsidian.

## Plugin Activation

1. Open `Settings` -> `Community plugins`.
2. Enable `Review & Critic`.

Once enabled, commands are available in the Command Palette.

## Commands

### 1. Insert Comment

Command: `Comment`

Behavior:

- With no selection: inserts a standalone comment token at cursor.
- With selection: wraps selected text as highlight and appends an anchored comment (safe, no text loss).
- Uses configured author name when available.

Output format:

```text
{>> [author=Your Name]  <<}
```

### 2. Add Comment to Selection (Anchored Comment)

Command: `Comment Selection`

Behavior:

- Requires non-empty selection.
- Wraps selected text as highlight and appends a comment token.

Output format:

```text
{==selected text==}{>> [author=Your Name]  <<}
```

### 3. Mark Selection as Addition

Command: `Add`

Behavior:

- Requires non-empty selection.
- Wraps selection as addition.

Output format:

```text
{++selected text++}
```

### 4. Mark Selection as Deletion

Command: `Delete`

Behavior:

- Requires non-empty selection.
- Wraps selection as deletion.

Output format:

```text
{--selected text--}
```

### 5. Highlight Selection

Command: `Highlight`

Behavior:

- Requires non-empty selection.
- Wraps selection as highlight.

Output format:

```text
{==selected text==}
```

### 6. Mark Selection as Substitution

Command: `Replace`

Behavior:

- Requires non-empty selection.
- Creates substitution template.

Output format:

```text
{~~selected text~>~~}
```

### 7. Open Comments Pane

Command: `Comments Pane`

Behavior:

- Opens/focuses the plugin comments pane.
- Shows comments from the active note.
- Clicking an entry navigates the cursor to its source location.

## Rendering Features

### Reading View Rendering

Activation:

- `Settings` -> `Review & Critic` -> enable `Enable Reading View Rendering`.

Behavior:

- CriticMarkup/review tokens are rendered with visual styles.
- Comment text is not shown inline in Reading View.
  - Anchored comments show on hover over the highlighted text.
  - Standalone comments show as a comment badge with hover tooltip.
- Token-like text inside code blocks is ignored.

### Live Preview Decoration

Activation:

- `Settings` -> `Review & Critic` -> enable `Enable Live Preview Decoration`.

Behavior:

- Tokens remain editable plain text, but are decorated in editor with per-token styling.

## Settings and Personalization

Location:

- `Settings` -> `Review & Critic`

Available options:

- `Default Author Name`
- `Enable Reading View Rendering`
- `Enable Live Preview Decoration`
- `Preview Mode Colors`
- `Editing Mode Colors`
- `Preview Mode Text Colors`
- `Editing Mode Text Colors`

All settings are persisted across restarts.

## Current v1 Scope Notes

Included:

- Comment/anchor commands
- Addition/deletion/substitution marking
- Reading and Live Preview visual treatment
- Active-note comments pane and navigation
- Persisted personalization settings

Not included in v1:

- Track-changes accept/reject workflows
- Whole-vault review browser
- Multi-user sync/reconciliation logic
