# Product Requirements Document (PRD)

## Obsidian Review & Critic Plugin: Phase 2

- **Document version:** 0.1
- **Status:** Draft
- **Prepared for:** Phase 2 implementation handoff
- **Product owner:** Daniel Rohrbach
- **Primary platform:** Obsidian Desktop
- **Document type:** Product Requirements Document

---

## 1. Executive Summary

Phase 2 expands the plugin from manual review markup into an editor-assisted editorial workflow. The central capability is a new **Track Changes Mode** that automatically creates CriticMarkup-based additions, deletions, and substitutions while the user edits text.

This phase also introduces:

1. **Track Changes Mode** for automatic change capture during typing and deletion.
2. **Accept / reject workflows** for individual changes and all changes in a note.
3. **A dedicated changes pane** for reviewing and resolving pending edits.
4. **Comment actions** in the comments pane, including accept/remove and resolve/remove.
5. **Saved color themes** for review styling, with create, switch, and delete behavior.
6. **A simplified reading mode** that can hide markup and show text as though all changes were accepted.

The product must continue to preserve Markdown as the source of truth. Automatic behavior must remain deterministic, local-first, and reversible. The plugin should help users review and resolve changes more quickly without obscuring what is stored in the file.

---

## 2. Problem Statement

Version 1 establishes structured comments and manual review marks, but it still requires users to create editorial markup explicitly. That is workable for deliberate review, but it is too slow for natural editing workflows where users expect typed changes to become tracked changes automatically.

In addition, once markup exists, the current workflow does not yet provide efficient resolution mechanics. Users need ways to:

- turn tracked editing on and off intentionally,
- see raw markup or accepted-text views depending on context,
- accept or reject a single change quickly,
- accept all changes in a note,
- resolve comments without manually editing source syntax,
- and manage visual styles more efficiently than setting individual colors one by one.

Without those capabilities, the plugin remains a markup authoring tool rather than a full editorial review workflow.

---

## 3. Product Vision

Enable users to edit Markdown in Obsidian with a track-changes-style workflow that remains plain-text, local-first, and fully inspectable.

---

## 4. Goals

### 4.1 Primary Goals

- Automatically create review markup while editing when Track Changes Mode is enabled.
- Provide clear ways to accept, reject, and resolve changes and comments.
- Make tracked edits navigable in a dedicated pane.
- Support a simplified accepted-text reading mode.
- Allow users to save and reuse color theme presets for review styling.

### 4.2 Secondary Goals

- Minimize accidental destructive edits while auto-tracking.
- Keep tracked editing behavior predictable in common editor interactions.
- Improve review throughput for authors and editors working through feedback.

---

## 5. Non-Goals

The following remain out of scope for this phase unless explicitly added later:

- Real-time multiplayer review state.
- Per-change author attribution for arbitrary local edits.
- Comment threading or replies.
- Change history timelines beyond current file markup.
- Whole-vault analytics dashboards.
- Word-style balloon comments outside Markdown source.
- Automatic merge/conflict resolution across sync providers.
- Mobile-first optimization beyond graceful degradation.

---

## 6. Target Users

### 6.1 Primary Users

- Writers revising drafts in multiple passes.
- Editors making tracked suggestions directly in Obsidian.
- Reviewers resolving comments and edits in a structured workflow.
- Teams using Markdown and Git who want tracked edits without leaving plain text.

### 6.2 User Characteristics

- Comfortable with text editing and Markdown-based review.
- Expect fast acceptance/rejection workflows similar to traditional word processors.
- Need explicit control over whether edits are tracked or directly applied.

---

## 7. Core Use Cases

### UC-1: Type with track changes enabled

A user turns on Track Changes Mode and types directly into the note. Inserted text becomes addition markup automatically.

### UC-2: Delete text with track changes enabled

A user removes existing text with Backspace or Delete. The plugin converts the removed content into deletion markup instead of permanently removing it.

### UC-3: Replace selected text with track changes enabled

A user selects text and types replacement text. The plugin converts the interaction into substitution markup.

### UC-4: Read the note as accepted text

A user switches to a simplified reading mode where tracked markup is visually resolved as though all changes were accepted.

### UC-5: Accept or reject individual changes

A user accepts or rejects a single addition, deletion, or substitution via an easily accessible UI action.

### UC-6: Review all pending edits in a pane

A user opens a changes pane, sees all tracked edits in the current note, and resolves them one by one or in bulk.

### UC-7: Resolve review comments from the pane

A user uses the comments pane not only for navigation but also to remove comments or resolve them directly.

### UC-8: Save and switch visual themes

A user configures review colors, saves the configuration as a named theme, and later switches between themes or deletes unused themes.

---

## 8. Scope by Release

## 8.1 Phase 2 Included Scope

- Track Changes Mode toggle command.
- Automatic additions for inserted text.
- Automatic deletions for removed text.
- Automatic substitutions for replacing selected text.
- Accepted-text display mode for review reading.
- Single-change accept / reject actions.
- Accept-all changes for current note.
- Changes pane for current note.
- Comment pane actions for accept/remove and resolve/remove.
- Saved theme presets for review color settings.

## 8.2 Explicitly Deferred from Phase 2

- Per-change author attribution on auto-tracked edits.
- Change filtering by author.
- Whole-vault change browser.
- Keyboard shortcut remapping UI specific to resolution actions.
- Threaded comment resolution states.
- Semantic diffing beyond markup operations.

---

## 9. Product Principles

- **Markdown remains the source of truth.**
- **Automatic tracking must be predictable, not magical.**
- **Users must always be able to turn tracked editing on or off explicitly.**
- **Accept/reject operations must be reversible through normal undo when possible.**
- **Resolved views must never silently corrupt source markup.**
- **Fast resolution matters as much as markup creation.**

---

## 10. Functional Requirements

## 10.1 Track Changes Mode

### FR-1 Track Changes Mode toggle

The plugin shall provide a command that toggles Track Changes Mode on and off.

**Acceptance criteria:**

- The mode can be turned on or off from a command.
- The current state is visible to the user in an accessible way.
- The state persists according to product decision for session/plugin settings.

### FR-2 Automatic additions

When Track Changes Mode is enabled and the user inserts new text without an active selection, the plugin shall convert the inserted text into addition markup.

**Example:**

From:

```md
The report is clear.
```

User types `very ` before `clear`.

To:

```md
The report is {++very ++}clear.
```

### FR-3 Automatic deletions

When Track Changes Mode is enabled and the user removes existing text using deletion actions such as Backspace or Delete, the plugin shall preserve the removed content as deletion markup.

**Example:**

From:

```md
The report is unclear.
```

User deletes `un`.

To:

```md
The report is {--un--}clear.
```

### FR-4 Automatic substitutions

When Track Changes Mode is enabled and the user replaces a non-empty selection by typing, the plugin shall convert the interaction into substitution markup.

**Example:**

From:

```md
The wording is weak.
```

User selects `weak` and types `strong`.

To:

```md
The wording is {~~weak~>strong~~}.
```

### FR-5 Scoped tracking behavior

The plugin shall define and consistently apply tracked-editing behavior for:

- single-character insertion,
- multi-character insertion,
- single-character deletion,
- multi-character deletion,
- replacement of selected text,
- paste over selection,
- paste at cursor without selection.

### FR-6 Safe fallback behavior

If the plugin cannot safely transform an editing operation into CriticMarkup, it shall prefer a conservative fallback and must not silently corrupt the document.

---

## 10.2 Accepted-Text Viewing

### FR-7 Accepted-text display mode

The plugin shall provide a mode that hides review markup and renders the note as though all tracked changes were accepted.

In this view:

- additions appear as normal inserted text,
- deletions are hidden,
- substitutions show only replacement text,
- comments may either remain visible or follow a separately defined display rule.

### FR-8 Raw-markup display mode

The plugin shall continue to support a mode where markup remains visible and review state is explicit.

### FR-9 Easy switching between views

Users shall be able to switch between accepted-text display and markup-aware display through commands or clearly accessible controls.

---

## 10.3 Change Resolution

### FR-10 Accept single addition

Accepting an addition shall remove the `{++ ++}` wrapper and keep the inserted text.

### FR-11 Reject single addition

Rejecting an addition shall remove the entire addition, including its content.

### FR-12 Accept single deletion

Accepting a deletion shall remove the entire deletion token, including its deleted content.

### FR-13 Reject single deletion

Rejecting a deletion shall remove the `{-- --}` wrapper and keep the original text.

### FR-14 Accept single substitution

Accepting a substitution shall keep only the replacement text.

### FR-15 Reject single substitution

Rejecting a substitution shall keep only the original text.

### FR-16 Accept all changes

The plugin shall provide an action to accept all tracked changes in the current note.

### FR-17 Reject all changes

The plugin may provide reject-all behavior if implementation cost and UX are acceptable in this phase; if deferred, that decision must be explicit.

### FR-18 Resolution accessibility

Accept / reject actions shall be available through at least one of:

- pane actions,
- context actions near the markup,
- or commands.

At least one workflow must be fast enough for repeated use.

---

## 10.4 Changes Pane

### FR-19 Current-note changes pane

The plugin shall provide a side pane listing tracked additions, deletions, and substitutions for the active note.

Each item should include:

- change type,
- affected text,
- replacement text when relevant,
- line number or approximate position,
- nearest heading context,
- resolution actions.

### FR-20 Navigate from changes pane

Clicking a change item shall navigate to the corresponding location in the note.

### FR-21 Resolve from changes pane

Each change item shall provide accept and reject actions appropriate to its type.

### FR-22 Bulk action in changes pane

The changes pane shall provide at least an accept-all action for the current note.

### FR-23 Empty state

If the active note has no tracked changes, the pane shall display a clear empty state.

---

## 10.5 Comments Pane Enhancements

### FR-24 Comment pane actions

The comments pane shall provide direct actions for handling comments.

Minimum required actions:

- resolve/remove comment,
- accept/remove anchored comment markup where applicable.

### FR-25 Comment removal behavior

Resolving or accepting a comment shall remove the relevant comment markup from the source text.

### FR-26 Anchored comment cleanup

The product shall define whether resolving an anchored comment also removes the associated highlight or leaves it as plain highlight markup. That behavior must be consistent and documented.

---

## 10.6 Theme Presets

### FR-27 Save named theme preset

Users shall be able to save the current review color configuration as a named theme.

### FR-28 Switch theme preset

Users shall be able to switch between saved theme presets from settings via a dropdown or list.

### FR-29 Delete theme preset

Users shall be able to delete saved presets they no longer want.

### FR-30 Persist theme presets

Saved theme presets shall persist across Obsidian restarts.

### FR-31 Theme application behavior

Selecting a saved theme shall immediately update active review colors in the UI.

### FR-32 Default vs custom themes

The product shall define whether built-in defaults are protected from deletion. If protected, the UI must make that clear.

---

## 11. User Experience Requirements

## 11.1 Track Changes UX

Track Changes Mode should feel intentional and safe.

Recommended behavior:

- a visible indicator shows whether tracking is on,
- typing with tracking on immediately produces review markup,
- turning tracking off restores normal editing behavior,
- mode switching should not rewrite existing markup automatically.

## 11.2 Accepted-Text View UX

The simplified accepted-text mode should prioritize readability.

Recommended behavior:

- useful for reviewing final wording without markup noise,
- clearly distinct from the raw markup mode,
- does not mislead the user about what is persisted in the file.

## 11.3 Resolution UX

Accept / reject controls should be fast and obvious.

Recommended behavior:

- actions appear close to the relevant change in pane-based workflows,
- destructive outcomes are predictable,
- repeated resolution should feel like a checklist workflow.

## 11.4 Theme UX

Theme management should be lightweight.

Recommended behavior:

- save current colors under a typed name,
- switch from a dropdown,
- delete unused presets without affecting others,
- no need to manually re-enter each color every time.

---

## 12. User Stories

### US-1

As an editor, I want inserted text to be automatically marked as an addition when tracking is enabled so that I can edit naturally without manually wrapping changes.

### US-2

As an editor, I want deleted text to become deletion markup instead of disappearing so that authors can review what I removed.

### US-3

As a reviewer, I want replacing selected text to produce substitution markup so that original and proposed wording remain visible.

### US-4

As an author, I want to accept or reject changes quickly so that I can work through edits efficiently.

### US-5

As an author, I want a pane showing all pending changes so that I can review them systematically.

### US-6

As a reviewer, I want to resolve comments directly from the comments pane so that cleanup is faster.

### US-7

As a user, I want to save multiple review color themes so that I can switch between visual styles for different contexts.

### US-8

As a user, I want a simplified accepted-text view so that I can read the note without markup noise.

---

## 13. Edge Cases and Behavior Rules

The implementation must define and test behavior for:

- typing adjacent to existing markup boundaries,
- deleting part of already marked addition text,
- deleting part of already marked deletion text,
- replacing text that already contains markup,
- pasting multiline text with tracking enabled,
- deleting across punctuation or Markdown formatting,
- selections spanning multiple paragraphs,
- selections spanning multiple syntax tokens,
- undo/redo of tracked edits,
- interactions inside lists, headings, tables, and blockquotes,
- interactions near links, emphasis, and code spans,
- fenced code blocks,
- comment resolution leaving orphaned highlight markup,
- accepting all changes in notes with mixed comments and edits.

### Phase 2 behavioral rule for code regions

Tracked editing should avoid auto-transforming content inside fenced code blocks in this phase unless explicitly designed and tested.

### Phase 2 behavioral rule for malformed markup

Malformed existing markup shall not be silently normalized during tracked-edit operations.

---

## 14. Conceptual Data Model

```ts
export type ReviewChangeNode =
  | { type: 'addition'; from: number; to: number; text: string }
  | { type: 'deletion'; from: number; to: number; text: string }
  | { type: 'substitution'; from: number; to: number; oldText: string; newText: string };

export interface ChangePaneEntry {
  id: string;
  type: 'addition' | 'deletion' | 'substitution';
  from: number;
  to: number;
  line: number;
  heading: string;
  text?: string;
  oldText?: string;
  newText?: string;
}

export interface ReviewThemePreset {
  id: string;
  name: string;
  previewColors: ReviewColorSettings;
  editingColors: ReviewColorSettings;
  previewTextColors: ReviewColorSettings;
  editingTextColors: ReviewColorSettings;
}

export interface ReviewPluginSettings {
  authorName: string;
  enableReadingView: boolean;
  enableLivePreview: boolean;
  trackChangesEnabled: boolean;
  acceptedTextViewEnabled: boolean;
  activeThemePresetId?: string;
  themePresets: ReviewThemePreset[];
}
```

This data model is conceptual and may evolve during implementation.

---

## 15. Technical Constraints

- The plugin must continue to run locally inside Obsidian Desktop.
- Markdown files remain the persisted storage format.
- Automatic tracked editing must integrate safely with Obsidian editor behavior.
- Editor interception must not introduce obvious cursor traps or text corruption.
- Accept/reject operations must be deterministic text transforms.
- Pane actions must operate on source text, not only rendered DOM.

---

## 16. Quality Requirements

### 16.1 Reliability

- No silent content loss from auto-tracking.
- Resolution actions must produce predictable source transformations.
- Undo/redo must remain usable after tracked-edit operations.

### 16.2 Performance

- Typing with tracking enabled must remain responsive on normal note sizes.
- Pane updates should feel near-immediate for common files.
- Accept-all operations should complete quickly on typical documents.

### 16.3 Usability

- Track Changes Mode state must be obvious.
- Accept/reject actions must be easy to reach.
- Accepted-text mode must be easy to understand and exit.

### 16.4 Maintainability

- Auto-tracking logic should be isolated from rendering logic.
- Accept/reject transforms should be reusable across UI surfaces.
- Theme preset management should be isolated from low-level CSS application.

---

## 17. Testing Requirements

## 17.1 Unit Tests

Must cover:

- version-safe transform helpers for accept / reject operations,
- automatic insertion transformation,
- automatic deletion transformation,
- automatic substitution transformation,
- theme preset CRUD behavior,
- accepted-text rendering transforms,
- malformed markup safety behavior.

## 17.2 Integration Tests

Must cover:

- toggling Track Changes Mode,
- typing inserted text with tracking enabled,
- deleting text with tracking enabled,
- replacing selected text with tracking enabled,
- pane generation for tracked changes,
- accept / reject from pane actions,
- accept-all behavior,
- comments pane resolve behavior,
- theme preset persistence.

## 17.3 Manual Test Matrix

Must include:

- long-note editing with tracking on,
- rapid typing and deletion,
- mixed manual and automatic markup,
- accepted-text view switching,
- accepting and rejecting multiple change types,
- comments pane cleanup actions,
- settings preset creation, switching, and deletion.

---

## 18. Risks and Open Questions

### 18.1 Risks

- Automatic edit interception in Live Preview may be significantly more fragile than command-based insertion.
- Replacement logic across complex selections may be error-prone.
- Accept/reject transforms may create edge cases around adjacent markup.
- Accepted-text view may confuse users if it is not clearly separated from source state.

### 18.2 Open Questions

- Should track changes state persist globally, per-vault, or per-note session?
- Should accepted-text view affect comments, or only editorial change tokens?
- Should reject-all be included in this phase or deferred?
- Should resolving an anchored comment also remove its highlight?
- Should theme presets support import/export in a later phase?

---

## 19. Milestones

### Milestone 1: Track Changes Foundations

- editor interception strategy
- safe text transform helpers
- tracked insertion / deletion / substitution behavior

### Milestone 2: Resolution Engine

- accept / reject single change
- accept-all current note
- shared transform utilities

### Milestone 3: View Modes

- accepted-text display mode
- markup-aware display mode switching

### Milestone 4: Changes Pane

- change extraction
- pane rendering
- navigation and resolution actions

### Milestone 5: Comments Pane Enhancements

- resolve/remove comment actions
- anchored comment cleanup rules

### Milestone 6: Theme Presets

- saved presets
- dropdown/list switching
- deletion and persistence

### Milestone 7: Stabilization

- edge case handling
- documentation
- manual test pass

---

## 20. Definition of Done for Phase 2

Phase 2 is considered complete when all of the following are true:

- Users can toggle Track Changes Mode on and off.
- Insertions, deletions, and replacements are converted into CriticMarkup in supported scenarios.
- Users can switch between markup-aware mode and accepted-text display mode.
- Users can accept individual changes.
- Users can accept all changes in the current note.
- A changes pane lists and navigates tracked changes.
- The comments pane supports direct cleanup actions.
- Users can save, switch, and delete named color themes.
- Relevant parser, transform, and integration tests pass.
- No known severe document-corruption bugs remain open.

---

## 21. Future Directions

Potential later enhancements:

- reject-all current note if deferred from this phase,
- per-change attribution,
- whole-vault change review,
- keyboard-first accept/reject workflows,
- comment threads and resolved state metadata,
- import/export of theme presets,
- mobile refinement.

---

## 22. Recommended Companion Documents

1. **Technical Specification**
   - editor interception strategy
   - transform engine for accept / reject
   - pane architecture for changes and comments actions

2. **UX Notes / Wireframes**
   - track changes toggle affordance
   - accepted-text mode behavior
   - changes pane layout
   - theme preset settings UI

3. **Test Specification**
   - tracked edit scenarios
   - resolution transforms
   - accepted-text rendering expectations

---

## 23. Appendix A: Example Transformations

### Insert new text with tracking

```md
Before: The report is clear.
After: The report is {++very ++}clear.
```

### Delete text with tracking

```md
Before: The report is unclear.
After: The report is {--un--}clear.
```

### Replace selected text with tracking

```md
Before: The wording is weak.
After: The wording is {~~weak~>strong~~}.
```

### Accept deletion

```md
Before: The report is {--un--}clear.
After: The report is clear.
```

### Reject deletion

```md
Before: The report is {--un--}clear.
After: The report is unclear.
```

---

## 24. Appendix B: Implementation Handoff Notes

The recommended implementation path is:

1. Build a safe transform layer for accept / reject and tracked text edits.
2. Add Track Changes Mode toggle and core insertion/deletion/replacement behavior.
3. Implement accepted-text display mode.
4. Add changes pane with navigation and resolution actions.
5. Extend comments pane with cleanup actions.
6. Implement theme preset persistence and selection.

The transform layer should be treated as a first-class foundation. If that layer is not reliable, the rest of the phase will remain fragile.
