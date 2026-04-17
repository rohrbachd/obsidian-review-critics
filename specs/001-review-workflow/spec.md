# Feature Specification: Obsidian Review Workflow v1

**Feature Branch**: `001-review-workflow`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "Start with speckit.specify.md attempting to implement all that is stated in docs/obsidian-review-plugin-prd.md. Make sure to add a link to that PRD document."  
**Glossary**: [Obsidian Review Plugin PRD](/docs/obsidian-review-plugin-prd.md)

## Constitution Alignment (mandatory)

- Applies Principle I (Clear Scope and Requirements): scope, functional requirements, non-functional requirements, and acceptance scenarios are defined from the PRD.
- Applies Principle II (Maintainable Architecture): parsing, rendering, commands, and pane behavior are separated by responsibility.
- Applies Principle III (Quality and Testing): scenarios and measurable outcomes are explicit and independently testable.
- Applies Principle V (Automation and Documentation): behavior changes require command/docs updates.
- Exception: Constitution references unrelated legacy paths (`membershipops_*`) and is interpreted as "project PRD/technical docs must stay aligned".

## Clarifications

### Session 2026-04-17

- Q: What is the v1 nested CriticMarkup policy? -> A: Treat all nested CriticMarkup as plain text (no parsing inside another token).

## User Scenarios and Testing (mandatory)

### Story Priorities and Motivation

The feature adds a local-first markdown-native review workflow in Obsidian so users can author, review, and navigate editorial feedback without leaving plain text files. P1 covers comment authoring and navigation, P2 covers readable rendering in reading/live preview, and P3 covers settings and resilience for long-term daily use.

### User Stories (Prioritized)

### User Story - Add and Anchor Feedback (Priority: P1)

A reviewer can insert standalone comments or attach comments to selected text so feedback is precise and attributable.

**Why this priority**: This is the core value proposition and unlocks immediate practical usage.

**Independent Test**: User can create standalone and anchored comments in a note and inspect resulting markdown syntax.

**Acceptance Scenarios**:

1. **Given** a cursor location and configured author, **When** the user inserts a comment, **Then** a comment token with author metadata is inserted at the cursor.
2. **Given** selected text, **When** the user adds a comment to selection, **Then** the text is wrapped as highlight and an adjacent comment token is appended.
3. **Given** empty selection, **When** user runs add-comment-to-selection, **Then** insertion is blocked with a clear user-facing message.

---

### User Story - Review and Navigate Comments (Priority: P1)

An author/editor can open a comments pane for the active note, see all comments with context, and jump to source locations.

**Why this priority**: Review becomes manageable only when all comments are discoverable and navigable.

**Independent Test**: A note with multiple comment forms shows entries in the pane; clicking each entry moves the editor cursor.

**Acceptance Scenarios**:

1. **Given** an active note with comments, **When** comments pane is opened, **Then** comments are listed with comment text, author, and context snippet.
2. **Given** a listed comment item, **When** the item is clicked, **Then** the editor focuses the mapped source position.
3. **Given** no comments in active note, **When** pane is shown, **Then** an explicit empty state is displayed.

---

### User Story - Readable Rendering During Review (Priority: P2)

A user reviewing content can visually distinguish additions, deletions, substitutions, highlights, and comments in reading and live preview modes.

**Why this priority**: Rendering quality determines usability for review-heavy sessions.

**Independent Test**: A fixture note containing all syntax types displays distinct visual treatments in both modes.

**Acceptance Scenarios**:

1. **Given** reading view enabled, **When** note is rendered, **Then** supported review syntax appears with distinct visual styling and anchored association cues.
2. **Given** live preview decoration enabled, **When** editing around markup, **Then** content remains editable/selectable and no cursor trap is introduced.
3. **Given** malformed markup, **When** rendering/parsing occurs, **Then** malformed text remains literal and unmodified.

---

### User Story - Persistent Personalization (Priority: P3)

Users can configure default author identity and rendering preferences that survive restarts.

**Why this priority**: Personalization reduces repetitive input and supports varied review workflows.

**Independent Test**: Change settings, reload Obsidian, verify values remain and commands honor configured defaults.

**Acceptance Scenarios**:

1. **Given** updated author name, **When** new comments are inserted, **Then** inserted templates use the configured author.
2. **Given** toggles changed for reading/live preview behavior, **When** reopening Obsidian, **Then** behavior matches saved settings.

### Edge Cases

- Empty selection for selection-based commands must return a non-destructive warning.
- Syntax-looking text inside fenced code blocks is excluded from parsing/decorating.
- Orphan highlight without adjacent comment is treated as standalone highlight.
- Orphan comment without valid preceding highlight is treated as standalone comment.
- Adjacent punctuation and markdown emphasis/link syntax must remain intact after command insertion.
- Multiline comment text may be listed but malformed/unclosed comments remain plain text.
- Nested CriticMarkup token patterns are treated as plain text in v1.0.
- Pane refresh on active file switch or vault modification must avoid stale entries.

## Non-Goals (v1.0 Scope Boundaries)

- Automatic track changes while typing.
- Accept/reject single change workflows.
- Accept/reject all changes in file workflows.
- Resolved/unresolved comment state management.
- Comment filtering by author in the pane.
- Whole-vault comments browser or analytics dashboards.
- Real-time collaborative editing or shared identity resolution.
- Export workflows to Word or Google Docs formats.
- Threaded discussions or replies on comments.

## Explicit v1 Decisions for PRD Open Questions

- **Multiline comments**: Supported when the comment token is syntactically valid and closed; unclosed multiline comments remain plain text and are not parsed.
- **Multiple comments on the same highlighted span**: Not supported as a first-class anchored thread in v1.0. Only the immediately adjacent highlight-comment pair is treated as anchored; additional comments are treated as standalone comments.

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: System MUST support CriticMarkup-inspired tokens for addition, deletion, substitution, highlight, and comments.
- **FR-002**: System MUST support comment author metadata in comment tokens.
- **FR-003**: System MUST recognize anchored comments when highlight token is immediately followed by a comment token with optional whitespace only.
- **FR-004**: System MUST preserve markdown source and MUST NOT migrate review data into external storage.
- **FR-005**: System MUST provide commands to insert standalone comments, create anchored comments from selections, and mark selections as addition/deletion/substitution.
- **FR-006**: System MUST provide a command to open/focus the comments pane.
- **FR-007**: Reading-mode output MUST visually distinguish each supported token type and clearly indicate anchored relationships.
- **FR-008**: Live preview MUST provide visual decoration while preserving source editability and selection behavior.
- **FR-009**: Parser MUST ignore code-fenced regions and leave malformed syntax as literal text.
- **FR-010**: Comments pane MUST list comments for the active note with author, comment text, snippet, heading context, and approximate location.
- **FR-011**: Clicking a comments pane item MUST navigate to the associated source location.
- **FR-012**: Comments pane MUST refresh on active-note changes and content edits.
- **FR-013**: Settings MUST include default author, reading/live preview toggles, and color configuration for both preview and editing contexts.
- **FR-014**: Settings MUST persist across restarts.
- **FR-015**: The documentation for this feature MUST include a direct reference to the PRD source document.
- **FR-016**: System MUST support closed multiline comment bodies and MUST leave unclosed multiline comment-like text unparsed.
- **FR-017**: System MUST interpret only one immediately adjacent comment as anchored to a highlight in v1.0; subsequent comments at the same location are standalone comments.
- **FR-018**: System MUST treat nested CriticMarkup tokens as plain text in v1.0 and MUST NOT parse inner tokens inside another review token.

### Key Entities (include if feature involves data)

- **Review Token**: Parsed representation of one markup unit (addition, deletion, substitution, highlight, comment, anchored-comment) with source ranges.
- **Comment Entry**: Flattened pane item containing comment text, author, snippet, heading context, and navigation position.
- **Plugin Settings Profile**: Persisted user-level preferences for author identity, rendering toggles, and display colors.
- **Active Note Review State**: Current-note parsed output used by rendering and comments pane refresh logic.

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: In manual acceptance testing, users can create standalone and anchored comments in under 15 seconds per action.
- **SC-002**: For a note containing at least 50 review tokens, comments pane refresh completes in 500 ms or less (measured from active-note change or file modify event to pane render completion) on a benchmark profile of at least 4 CPU cores, 16 GB RAM, and SSD storage.
- **SC-003**: At least 95% of pane items navigate to the intended source position on first click during test runs.
- **SC-004**: In a scripted usability check with 20 mixed review tokens, users correctly identify token type for at least 18 of 20 tokens (90%) in Reading view without opening raw source.
- **SC-005**: Settings changes persist across restart with 100% retention in validation checks.

## Assumptions

- Primary support target is Obsidian Desktop.
- Manual insertion commands are sufficient for v1.0; automated track changes remains out of scope.
- Single-note comments pane scope is intentional; whole-vault browsing is deferred.
- Nested CriticMarkup parsing is explicitly out of scope for v1.0 and nested token text is preserved literally.
