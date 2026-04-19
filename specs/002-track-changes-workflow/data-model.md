# Data Model: Track Changes Workflow

## Delta vs Canonical

Reference canonical baseline: [docs/data-model.md](../../docs/data-model.md)

### New entities

- `TrackedChangeEntry`
- `QuickActionRequest`
- `ThemePreset`
- `ThemePresetRegistry`

### Changed entities

- `ReviewPluginSettings` (adds track/display/theme fields)
- `CommentPaneEntry` (adds optional actionability metadata)

### No removals

- Existing token entities remain valid.

## Entity: TrackedChangeEntry

Represents one pending tracked edit in the active note for pane listing and resolution.

- Fields:
  - `id`: stable identifier for current parse cycle
  - `type`: `addition | deletion | substitution`
  - `from`: source start offset
  - `to`: source end offset
  - `line`: 1-based line index
  - `heading`: nearest heading context
  - `text?`: normalized text for addition/deletion
  - `oldText?`: substitution source text
  - `newText?`: substitution replacement text
- Validation rules:
  - `type` must map to one supported change token
  - `from < to`
  - substitution requires both `oldText` and `newText`

## Entity: QuickActionRequest

Represents a quick-action invocation from pane/toolbar UI against active editor state.

- Fields:
  - `action`: `add | delete | highlight | replace | comment`
  - `hasSelection`: boolean
  - `selectionText?`: selected text when present
  - `cursorOffset`: active cursor position
- Validation rules:
  - `selectionText` required when `hasSelection=true`
  - for `delete | highlight | replace`, no-selection path is no-op

## Entity: ThemePreset

Named review color set persisted in plugin settings.

- Fields:
  - `id`: unique stable ID
  - `name`: user-visible label (case-insensitive uniqueness)
  - `previewColors`: `insert/addition/deletion/comment/highlight`
  - `editingColors`: `insert/addition/deletion/comment/highlight`
  - `previewTextColors`: `insert/addition/deletion/comment/highlight`
  - `editingTextColors`: `insert/addition/deletion/comment/highlight`
  - `isBuiltIn`: boolean
- Validation rules:
  - `name` non-empty after trim
  - `name` unique case-insensitively
  - `isBuiltIn=true` presets cannot be deleted

## Entity: ThemePresetRegistry

Container for theme-related persistent state.

- Fields:
  - `presets`: array of `ThemePreset`
  - `activePresetId?`: currently selected preset
- Validation rules:
  - `activePresetId`, when set, must exist in `presets`
  - at least one preset always available

## Changed Entity: ReviewPluginSettings

Existing settings entity with new fields:

- Added fields:
  - `trackChangesEnabled`: boolean
  - `acceptedTextViewEnabled`: boolean
  - `themePresets`: `ThemePreset[]`
  - `activeThemePresetId?`: string
- Existing fields remain:
  - `authorName`
  - `enableReadingView`
  - `enableLivePreview`
  - color maps (`previewColors`, `editingColors`, `previewTextColors`, `editingTextColors`)

## Changed Entity: CommentPaneEntry

Optional actionability metadata for comments pane actions:

- Added optional fields:
  - `isAnchored?`: boolean
  - `canResolve?`: boolean

## State transitions

### Track mode state

- `trackChangesEnabled: false -> true` via command/toggle
- `trackChangesEnabled: true -> false` via command/toggle

### Display mode state

- `acceptedTextViewEnabled: false -> true` via command/toggle
- `acceptedTextViewEnabled: true -> false` via command/toggle

### Theme lifecycle

- `create`: new preset appended (or overwrite existing name by confirmation)
- `activate`: `activeThemePresetId` set
- `delete custom`: preset removed, active preset re-pointed if needed
- `delete built-in`: rejected

## Authoritative stores

- Markdown note content: authoritative for tracked review markup and comment markup.
- Plugin settings store: authoritative for mode flags and theme presets.
