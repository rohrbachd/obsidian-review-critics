# Feature Specification: Track Changes Workflow

**Feature Branch**: `002-track-changes-workflow`  
**Created**: 2026-04-19  
**Status**: Draft  
**Input**: User description: "Create phase 2 track changes workflow specification from docs/obsidian-review-plugin-prd-phase-2.md. Reference document: docs/obsidian-review-plugin-prd-phase-2.md. Include Track Changes Mode, accepted-text view, accept/reject changes, changes pane, comment cleanup actions, and saved color theme presets."  
**Glossary**: [docs/obsidian-review-plugin-prd-phase-2.md](../../docs/obsidian-review-plugin-prd-phase-2.md)
**Design Decision Record**: [design-decision-markdown-structure-handling-2026-04-21.md](./design-decision-markdown-structure-handling-2026-04-21.md)

## Constitution Alignment (mandatory)

- **Clear Scope and Requirements**: This specification defines Phase 2 scope, requirements, acceptance scenarios, measurable success criteria, and explicit exclusions before planning.
- **Maintainable Architecture**: The feature requires separately testable behavior for tracked edits, change resolution, pane presentation, and theme preset management; shared review concepts should remain consistent across user surfaces.
- **Quality and Testing**: Each user story is independently testable and includes acceptance scenarios. Critical behavior includes content transforms, persistence, pane updates, and user-visible mode switching.
- **Security and Privacy**: All review data remains inside the user's Markdown notes or plugin settings. No external services, telemetry, or network transfer are introduced by this feature.
- **Automation and Documentation**: User-facing behavior changes must update documentation, and validation must cover build, formatting, linting, and tests before release.

No constitution exceptions are requested.

## Clarifications

### Session 2026-04-19

- Q: Should Phase 2 include reject actions for individual additions, deletions, and substitutions? -> A: Include reject actions for individual additions, deletions, and substitutions in Phase 2.
- Q: What should quick-action buttons do when no text is selected? -> A: Add inserts empty addition markup with the cursor inside it; Comment inserts an empty comment; deletion, highlight, and replacement actions leave content unchanged.
- Q: How should continuous typed additions be grouped? -> A: Continuous typing in the same addition extends that addition; adjacent additions with no original text between them merge into one addition.
- Q: How should consecutive deletion operations be grouped? -> A: Consecutive deletion of adjacent original text merges into one deletion.
- Q: Should accepted-text display hide comments? -> A: Accepted-text display hides editorial change markup but keeps comments visible.
- Q: How should duplicate theme names be handled? -> A: Theme names are unique case-insensitively; duplicate save attempts ask the user to overwrite the existing theme or choose another name.

### Session 2026-04-21

- Q: Should substitution syntax be changed from canonical CriticMarkup to a custom hybrid form? -> A: Keep canonical CriticMarkup substitution syntax and improve rendering behavior instead of changing syntax.
- Q: How should structural Markdown edits (tables, headings, lists, code fences, callouts, separators, links, footnotes, block math) be handled in Track Changes mode? -> A: Use a stability-first strategy where structural/syntax-sensitive edits are protected and may bypass automatic tracked transformation to prevent content corruption.
- Q: How should formatting-toggle actions and syntax-heavy edits be handled when safe tracked representation is uncertain? -> A: Prefer safe bypass over unsafe transformation; preserve user content and editor stability first.
- Q: Should bypassed structural edits appear in the Changes pane? -> A: No. Do not show bypassed structural edits in the Changes pane.
- Q: What runtime feedback should be shown for bypassed structural edits? -> A: Show one non-blocking notice per session when the first bypass occurs.
- Q: How should mixed selections be handled when they include both inline-safe and syntax-sensitive content? -> A: If any part is syntax-sensitive, bypass tracking for the entire transaction.
- Q: How should quick actions behave on syntax-sensitive selections? -> A: Do not modify content and show a clear non-blocking notice that the selection is protected.
- Q: How should accepted-text mode display structural content represented in CriticMarkup tokens? -> A: Render a resolved accepted-text projection through Markdown so structural formatting appears correctly while source markup remains unchanged.

## User Scenarios and Testing (mandatory)

### Story Priorities and Motivation

Phase 2 turns the plugin from a manual markup helper into a practical review workflow. The highest priority is safe Track Changes Mode because it creates the source material for every later review action. Change resolution and the changes pane follow because they let authors process tracked edits efficiently. Comment cleanup and theme presets improve review throughput and usability once core tracking is reliable.

### User Stories (Prioritized)

### User Story - Track Edits While Typing (Priority: P1)

As an editor, I want Track Changes Mode to automatically mark inserted, deleted, and replaced text so that I can edit naturally while preserving review intent.

**Why this priority**: Without automatic tracked edits, Phase 2 does not deliver its main user value.

**Independent Test**: Can be tested by turning tracking on, performing insertion, deletion, and replacement actions in a note, and verifying that the resulting text contains the expected review markup without losing original content.

**Acceptance Scenarios**:

1. **Given** Track Changes Mode is on and the cursor is placed in existing text, **When** the user types new text without selecting anything, **Then** the inserted text is represented as an addition.
2. **Given** Track Changes Mode is on and existing text is selected, **When** the user types replacement text, **Then** the selected text and replacement are represented as a substitution.
3. **Given** Track Changes Mode is on and the user deletes existing text, **When** the deletion completes, **Then** the removed text remains visible as a deletion.
4. **Given** Track Changes Mode is off, **When** the user edits text, **Then** the text changes normally without new review markup.
5. **Given** Track Changes Mode is on and the cursor remains inside the same addition, **When** the user continues typing, **Then** the existing addition is extended instead of creating a second addition.
6. **Given** Track Changes Mode is on and newly inserted text is adjacent to an existing addition with no original text between them, **When** the insertion completes, **Then** the adjacent additions are merged into one addition.
7. **Given** Track Changes Mode is on and the user continues deleting adjacent original text, **When** each deletion completes, **Then** the deleted text is represented as one merged deletion rather than multiple adjacent deletion tokens.
8. **Given** Track Changes Mode is on and the user edits structural Markdown syntax, **When** the edit is classified as syntax-sensitive, **Then** the system preserves content and bypasses unsafe automatic tracked transformation.
9. **Given** a substitution is displayed in markup-aware mode, **When** the cursor enters the substitution token, **Then** old and new parts remain visually distinguishable and strike-through applies only to the original side.
10. **Given** Track Changes Mode is on and one edit selection includes both inline-safe and syntax-sensitive content, **When** the edit is applied, **Then** tracked transformation is bypassed for the full transaction.

---

### User Story - Review Text As Accepted (Priority: P2)

As an author, I want to view the note as if tracked changes were accepted so that I can read the final proposed text without markup noise.

**Why this priority**: Users need a low-friction way to understand the proposed final text before accepting changes.

**Independent Test**: Can be tested with a note containing additions, deletions, and substitutions by switching between markup-aware display and accepted-text display and verifying both views are clear and reversible.

**Acceptance Scenarios**:

1. **Given** a note contains additions, deletions, and substitutions, **When** accepted-text display is enabled, **Then** additions appear as normal text, deletions are hidden, and substitutions show only replacement text.
2. **Given** accepted-text display is enabled, **When** the user switches back to markup-aware display, **Then** the review markup is again visible and no source content has been accepted or rejected automatically.
3. **Given** a note contains comments, **When** accepted-text display is enabled, **Then** comments remain visible as unresolved review feedback.
4. **Given** accepted-text display is enabled and tracked tokens contain structural Markdown content, **When** the note is rendered, **Then** the accepted-text projection is rendered through Markdown so headings/lists/callouts/code-like structures appear with normal structural formatting while source markup remains unchanged.

---

### User Story - Accept or Reject Individual Changes and Accept Bulk Changes (Priority: P3)

As an author, I want to accept or reject tracked changes individually and accept all changes at once so that I can efficiently finalize a reviewed note.

**Why this priority**: Track changes are only useful if users can resolve them without manually editing markup.

**Independent Test**: Can be tested with one note containing each change type and verifying that accepting and rejecting a single change produce the expected text, and that accepting all changes produces the expected final text.

**Acceptance Scenarios**:

1. **Given** a note contains an addition, **When** the user accepts it, **Then** the wrapper is removed and the inserted text remains.
2. **Given** a note contains a deletion, **When** the user accepts it, **Then** the deleted text and wrapper are removed.
3. **Given** a note contains a substitution, **When** the user accepts it, **Then** only the replacement text remains.
4. **Given** a note contains an addition, deletion, or substitution, **When** the user rejects the change, **Then** the note keeps the text that existed before the proposed change.
5. **Given** a note contains multiple tracked changes, **When** the user chooses accept all, **Then** all additions, deletions, and substitutions are resolved as accepted in the current note.

---

### User Story - Quick Review Actions in a Pane (Priority: P4)

As an author, I want a pane with quick-action buttons for addition, deletion, highlight, replacement, and comment insertion so that I can apply common review markup at the current cursor position or current selection without opening the command palette each time.

**Why this priority**: Quick buttons reduce friction for repeated review actions and make the plugin usable as an always-visible editing toolbar.

**Independent Test**: Can be tested by opening the quick actions pane, placing the cursor or selecting text in a note, pressing each quick-action button (including replacement), and verifying that the expected review markup is inserted or applied at the active editor location.

**Acceptance Scenarios**:

1. **Given** the quick actions pane is open and the editor cursor is active in a note, **When** the user presses the Add button with no selection, **Then** empty addition markup is inserted and the cursor is placed where the added text should be typed.
2. **Given** text is selected in the active note, **When** the user presses the Delete button, **Then** the selected text is wrapped as a deletion.
3. **Given** no text is selected, **When** the user presses the Delete button, **Then** no deletion markup is inserted and no file content is changed.
4. **Given** text is selected in the active note, **When** the user presses the Highlight button, **Then** the selected text is wrapped as a highlight.
5. **Given** no text is selected, **When** the user presses the Highlight or replacement action, **Then** no markup is inserted and no file content is changed.
6. **Given** the editor cursor is active in a note, **When** the user presses the Comment button, **Then** an empty comment is inserted at the cursor using the configured author when available.
7. **Given** no Markdown editor is active, **When** the user presses a quick-action button, **Then** the system shows a clear message and does not modify any file.
8. **Given** text is selected and the selection includes syntax-sensitive Markdown, **When** the user presses Add/Delete/Highlight/Replace quick actions, **Then** no content is modified and a clear non-blocking notice explains the protected selection.

---

### User Story - Review Pending Changes in a Pane (Priority: P5)

As an author, I want a pane listing all pending changes in the current note so that I can navigate and resolve edits systematically.

**Why this priority**: A pane turns scattered inline markup into an actionable checklist.

**Independent Test**: Can be tested by opening a note with several tracked edits, opening the changes pane, navigating to entries, and resolving changes from the pane.

**Acceptance Scenarios**:

1. **Given** the active note contains tracked changes, **When** the changes pane is opened, **Then** each change is listed with type, affected text, location, and available resolution actions.
2. **Given** a listed change, **When** the user selects it, **Then** focus moves to the corresponding location in the note.
3. **Given** the active note has no tracked changes, **When** the changes pane is opened, **Then** a clear empty state is shown.
4. **Given** the user made only syntax-sensitive edits that were safely bypassed, **When** the changes pane is opened, **Then** those bypassed edits are not listed and the standard empty-state behavior remains.

---

### User Story - Resolve Comments from the Comments Pane (Priority: P6)

As a reviewer or author, I want comment cleanup actions in the comments pane so that resolved feedback can be removed without manually editing markup.

**Why this priority**: Comments and changes are part of the same review workflow, and comments need an equally direct cleanup path.

**Independent Test**: Can be tested by creating standalone and anchored comments, opening the comments pane, using cleanup actions, and verifying the comment markup is removed correctly.

**Acceptance Scenarios**:

1. **Given** a standalone comment is listed in the comments pane, **When** the user resolves it, **Then** the comment markup is removed from the note.
2. **Given** an anchored comment is listed in the comments pane, **When** the user resolves it, **Then** the comment markup is removed and the reviewed text remains readable.

---

### User Story - Save and Switch Review Themes (Priority: P7)

As a user, I want to save named color themes and switch between them so that I can reuse visual review styles without re-entering individual color values.

**Why this priority**: Theme presets improve comfort and accessibility but do not block the core review workflow.

**Independent Test**: Can be tested by creating a named theme from current colors, switching to it, deleting it, and restarting the app to verify persistence.

**Acceptance Scenarios**:

1. **Given** the user has configured review colors, **When** they save a named theme, **Then** the theme appears in the available theme list.
2. **Given** multiple saved themes exist, **When** the user selects a theme, **Then** the active review colors update immediately.
3. **Given** a custom theme exists, **When** the user deletes it, **Then** it is removed from the theme list and can no longer be selected.
4. **Given** a saved theme already exists, **When** the user attempts to save another theme with the same name using different casing, **Then** the user is asked to overwrite the existing theme or choose another name.

### Edge Cases

- Track Changes Mode is active and the user edits adjacent to existing review markup.
- Track Changes Mode is active and typed text is adjacent to an existing addition with no original text boundary.
- Track Changes Mode is active and consecutive deletions remove adjacent original text.
- A selection spans multiple paragraphs or multiple review tokens.
- The user pastes multiline content with and without an active selection.
- The user deletes text inside headings, lists, blockquotes, links, emphasis, or inline code.
- The user attempts tracked edits inside fenced code blocks.
- The user performs edits in tables that include existing tracked markup in neighboring cells.
- The user edits heading markers (`#`) and blank-line boundaries around headings while Track Changes Mode is enabled.
- The user inserts or removes fenced code, callouts, horizontal separators, block math, links, or footnotes while Track Changes Mode is enabled.
- The user invokes formatting toggles (bold/italic/strikethrough/inline code) around existing tracked tokens.
- Accepted-text display is enabled for tracked tokens whose resolved text contains structural Markdown syntax.
- Existing markup is malformed before a tracked edit occurs.
- Undo or redo is used immediately after an automatic tracked edit or an accept-all action.
- The active file changes while a changes pane or comments pane is open.
- A quick-action button is pressed when no Markdown editor is focused.
- A quick-action button is pressed with a collapsed cursor versus a non-empty selection.
- A comment cleanup action would leave an orphaned highlight or empty line.
- A saved theme name duplicates an existing theme name with the same or different casing.

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: Users MUST be able to toggle Track Changes Mode on and off through a discoverable command or control.
- **FR-002**: The system MUST show the current Track Changes Mode state in a user-visible way.
- **FR-003**: Track Changes Mode state MUST persist across restarts until the user changes it.
- **FR-004**: When Track Changes Mode is enabled, inserting text without a selection MUST create an addition that preserves the inserted text.
- **FR-005**: When Track Changes Mode is enabled, deleting existing text MUST preserve the removed text as a deletion instead of silently discarding it.
- **FR-006**: When Track Changes Mode is enabled, replacing selected text MUST create a substitution that preserves both original and replacement text.
- **FR-007**: When Track Changes Mode is disabled, normal editing MUST occur without automatically adding review markup.
- **FR-008**: If a tracked edit cannot be safely represented, the system MUST avoid silent document corruption and leave the user with recoverable content.
- **FR-009**: Continuous typing inside the same addition MUST extend the existing addition rather than create a new addition.
- **FR-010**: Inserted text adjacent to an existing addition with no original text between them MUST be merged into the adjacent addition.
- **FR-011**: Consecutive deletion of adjacent original text MUST merge into one deletion rather than create multiple adjacent deletion tokens.
- **FR-012**: Users MUST be able to switch between markup-aware display and accepted-text display without permanently accepting or rejecting changes.
- **FR-013**: Accepted-text display MUST show additions as normal text, hide deletions, and show only replacement text for substitutions.
- **FR-014**: Accepted-text display MUST keep comments visible as unresolved review feedback.
- **FR-015**: Users MUST be able to accept or reject a single addition, deletion, or substitution.
- **FR-016**: Accepting an addition MUST keep the inserted text and remove addition markers.
- **FR-017**: Accepting a deletion MUST remove both deleted text and deletion markers.
- **FR-018**: Accepting a substitution MUST keep only the replacement text.
- **FR-019**: Users MUST be able to accept all tracked changes in the current note with one action.
- **FR-020**: Rejecting an addition MUST remove the inserted text and addition markers.
- **FR-021**: The system MUST provide a changes pane for the active note.
- **FR-022**: The changes pane MUST list additions, deletions, and substitutions in the active note.
- **FR-023**: Each changes pane item MUST show change type, affected text, location as nearest heading plus 1-based line number, and a short context snippet.
- **FR-024**: Selecting a changes pane item MUST navigate to the corresponding source location.
- **FR-025**: Users MUST be able to accept or reject individual changes from the changes pane.
- **FR-026**: The changes pane MUST provide an accept-all action for the current note.
- **FR-027**: The changes pane MUST show a clear empty state when no tracked changes are present.
- **FR-028**: The system MUST provide a visible quick actions pane or toolbar for common review actions.
- **FR-029**: The quick actions UI MUST include buttons for addition, deletion, highlight, replacement, and comment insertion.
- **FR-030**: Pressing a quick-action button MUST apply the action to the current selection when text is selected.
- **FR-031**: Pressing the Add quick-action button with no text selected MUST insert empty addition markup and place the cursor where added text should be typed.
- **FR-032**: Pressing the Comment quick-action button with no text selected MUST insert an empty comment at the cursor using the configured author when available.
- **FR-033**: Pressing deletion, highlight, or replacement quick actions with no text selected MUST leave file content unchanged.
- **FR-034**: Quick actions MUST operate on the active Markdown editor only and MUST show a clear message when no valid editor is active.
- **FR-035**: The comments pane MUST provide a direct action to resolve or remove standalone comments.
- **FR-036**: The comments pane MUST provide a direct action to resolve or remove anchored comments.
- **FR-037**: Resolving an anchored comment MUST remove comment markup while preserving the reviewed text as normal readable text.
- **FR-038**: Users MUST be able to save the current review color configuration as a named theme preset.
- **FR-039**: Users MUST be able to select a saved theme preset and see review colors update immediately.
- **FR-040**: Users MUST be able to delete custom theme presets.
- **FR-041**: Built-in default theme presets MUST remain available and cannot be deleted.
- **FR-042**: Theme presets MUST persist across restarts.
- **FR-043**: Theme preset names MUST be unique using case-insensitive comparison.
- **FR-044**: When a user saves a theme with a duplicate name, the system MUST ask whether to overwrite the existing theme or choose another name.
- **FR-045**: The authoritative persisted state for user preferences and theme presets MUST be the plugin settings data stored in the user's vault configuration area.
- **FR-046**: Markdown note content MUST remain the authoritative store for review markup and tracked changes.
- **FR-047**: Rejecting a deletion MUST keep the original text and remove deletion markers.
- **FR-048**: Rejecting a substitution MUST keep only the original text.
- **FR-049**: Reject-all changes is explicitly deferred from this feature.
- **FR-050**: The feature MUST NOT introduce telemetry, external accounts, or network transfer for tracked changes, comments, or theme presets.
- **FR-051**: Substitutions MUST continue using canonical CriticMarkup substitution syntax and MUST remain compatible with existing parser, pane, and resolution workflows.
- **FR-052**: In markup-aware display, substitution tokens MUST visually distinguish original and replacement parts, including while the cursor is inside the token, and strike-through MUST apply only to the original part.
- **FR-053**: Track Changes Mode MUST classify syntax-sensitive Markdown edits and prioritize content safety by bypassing automatic tracked transformation when no safe representation is available.
- **FR-054**: Syntax-sensitive edit classes MUST include at minimum tables, headings, lists, blockquotes/callouts, fenced code blocks, block math blocks, horizontal separators, link/image syntax, wiki links, and footnote syntax.
- **FR-055**: Bypassed syntax-sensitive edits MUST preserve the user’s edited content and MUST NOT introduce malformed review markup, nested token corruption, or unintended changes outside the edited region.
- **FR-056**: Existing table protection behavior MUST remain in effect as a non-regression requirement.
- **FR-057**: The system MUST provide clear user-facing documentation that structural/syntax-sensitive Markdown edits are protected and may not be auto-tracked.
- **FR-058**: If a tracked transform decision is uncertain between unsafe transform and safe bypass, the system MUST choose safe bypass.
- **FR-059**: The changes pane MUST list only tracked additions, deletions, and substitutions and MUST NOT include informational or resolvable entries for bypassed syntax-sensitive edits.
- **FR-060**: When the first syntax-sensitive edit bypass occurs in a session, the system MUST show one non-blocking notice (message key `review.trackChanges.protectedBypass`, user text equivalent to "Structural markdown edit kept as-is (not auto-tracked)."), and MUST suppress repeated notices for subsequent bypasses in the same session.
- **FR-061**: For any single edit transaction that overlaps both inline-safe and syntax-sensitive content, the system MUST apply safe bypass to the entire transaction instead of partial tracked transformation.
- **FR-062**: When Add/Delete/Highlight/Replace quick actions target a selection that includes syntax-sensitive Markdown, the system MUST leave file content unchanged and MUST show a clear non-blocking notice (message key `review.quickAction.protectedSelection`, user text equivalent to "Selection includes protected markdown; quick action not applied.").
- **FR-063**: Accepted-text display MUST render a resolved Markdown projection for tracked tokens so structural Markdown content is displayed with normal structural formatting while the underlying source markup remains authoritative and unchanged.

### Key Entities

- **Tracked Change**: A pending addition, deletion, or substitution in the active note. Key attributes include type, source range, displayed text, replacement text when applicable, location, and nearest context.
- **Track Changes Mode State**: The user's enabled or disabled state for automatic change capture.
- **Display Mode**: The user's choice between markup-aware display and accepted-text display.
- **Change Pane Entry**: A navigable representation of one tracked change in the active note, including resolution actions.
- **Quick Action**: A pane or toolbar button that applies a common review operation to the active cursor position or selected text.
- **Review Comment Entry**: A standalone or anchored comment that can be navigated to and resolved from the comments pane.
- **Theme Preset**: A named set of review color preferences that can be saved, selected, and deleted when custom.
- **Plugin Settings**: User preferences including mode state, active display options, active theme, and saved theme presets.

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: In a timed internal validation run using a predefined checklist and fixture note, a tester can enable Track Changes Mode and create an addition, deletion, and substitution in under 2 minutes.
- **SC-002**: For common notes under 10,000 words, p95 tracked-edit processing latency (single-cursor insert/delete transaction, measured in automated perf harness) MUST be <= 50 ms with Track Changes Mode enabled.
- **SC-003**: Users can accept all tracked changes in a note containing 50 changes in under 10 seconds.
- **SC-004**: Users can locate and navigate to any tracked change in the active note from the changes pane in under 5 seconds.
- **SC-005**: Users can apply addition, deletion, highlight, replacement, and comment quick actions from the pane without opening the command palette in 100% of manual quick-action test scenarios.
- **SC-006**: Accepted-text display accurately represents accepted output for additions, deletions, and substitutions while keeping comments visible in 100% of defined acceptance test fixtures.
- **SC-007**: Theme presets survive restart, restore selected colors, and handle duplicate-name overwrite prompts in 100% of persistence and naming tests.
- **SC-008**: No test fixture for tracked editing, accept-all, quick actions, or comment cleanup results in silent content loss outside the intended change resolution.
- **SC-009**: In manual and automated mixed-markdown fixtures containing tables, headings, lists, code fences, callouts, separators, links, and footnotes, 100% of edits complete without editor range errors or cross-region content corruption.
- **SC-010**: In substitution visualization checks, reviewers can consistently distinguish original versus replacement text in both inactive and active cursor states across all defined fixtures.
- **SC-011**: In accepted-text fixture checks containing headings, lists, callouts, and fenced-code-like tracked content, 100% of reviewed render states show structurally correct Markdown rendering without mutating source markup.

## Assumptions

- The phase-2 PRD at [docs/obsidian-review-plugin-prd-phase-2.md](../../docs/obsidian-review-plugin-prd-phase-2.md) is the source reference for this specification.
- Track Changes Mode is a user-level plugin setting, not a per-note property.
- Accepted-text display affects editorial change tokens and keeps comments visible unless they are explicitly resolved.
- Reject-all is deferred from this feature. Single-change reject behavior is included for additions, deletions, and substitutions.
- Resolving an anchored comment removes the comment markup and preserves the reviewed text in readable form.
- Built-in theme presets are protected from deletion; custom presets can be deleted.
- All review content remains local to the user's notes and plugin settings.
- Structural/syntax-sensitive Markdown edits are treated as safety-protected operations and may bypass automatic tracked transformation when needed.
- The design baseline and compatibility matrix for this behavior are defined in [design-decision-markdown-structure-handling-2026-04-21.md](./design-decision-markdown-structure-handling-2026-04-21.md).
