# Feature Data Model: Obsidian Review Workflow v1

## Delta vs Canonical

Compared to [docs/data-model.md](/d:/Development/obsidian-critics/docs/data-model.md):

- No new entities introduced beyond canonical baseline.
- No field-level deviations introduced.
- This feature uses the canonical entities directly for parser output, pane composition, and settings persistence.

## Entity: ReviewToken

### Description

A parsed token representing one review markup construct from markdown source.

### Fields

- `type` (enum): `addition`, `deletion`, `substitution`, `highlight`, `comment`, `anchoredComment`
- `from` (number): start offset in source (inclusive)
- `to` (number): end offset in source (exclusive)

### Variant Fields

- Addition: `text`
- Deletion: `text`
- Substitution: `oldText`, `newText`
- Highlight: `text`
- Comment: `text`, optional `author`
- AnchoredComment: `highlightedText`, `commentText`, optional `author`, `highlightRange`, `commentRange`

### Validation Rules

- Offsets must be within document bounds.
- AnchoredComment must be produced only when highlight/comment adjacency rule is satisfied.
- Nested token patterns are treated as plain text and should not emit inner tokens in v1.

## Entity: CommentPaneEntry

### Description

UI-facing representation of a review comment for the active-note pane.

### Fields

- `id` (string)
- `from` (number)
- `to` (number)
- `line` (number)
- `heading` (string)
- `commentText` (string)
- `author` (optional string)
- `highlightedText` (optional string)

### Validation Rules

- `line` must map to the current note content at generation time.
- `commentText` can be empty but entry must still render and navigate.

## Entity: ReviewPluginSettings

### Description

Persisted user preferences controlling insertion defaults and visual behavior.

### Fields

- `authorName` (string)
- `enableReadingView` (boolean)
- `enableLivePreview` (boolean)
- `previewColors` (object): `insert`, `addition`, `deletion`, `comment`, `highlight`
- `editingColors` (object): `insert`, `addition`, `deletion`, `comment`, `highlight`

### Validation Rules

- Color strings should be accepted as text and applied as CSS-compatible values.
- Missing settings keys fall back to defaults.

## Lifecycle Notes

- Tokens and pane entries are transient derivations from source markdown.
- Settings persist across restarts.
- Markdown source remains authoritative and is never rewritten outside explicit commands.
