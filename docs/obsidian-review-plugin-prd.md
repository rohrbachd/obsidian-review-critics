# Product Requirements Document (PRD)

## Obsidian Review & CriticMarkup Plugin

- **Document version:** 0.1
- **Status:** Draft
- **Prepared for:** Initial implementation handoff
- **Product owner:** Daniel Rohrbach
- **Primary platform:** Obsidian Desktop
- **Document type:** Product Requirements Document

---

## 1. Executive Summary

This product is an Obsidian plugin that adds a structured review workflow to Markdown notes using CriticMarkup-inspired syntax. The plugin enables users to create review comments and editorial suggestions directly inside plain-text Markdown files, render them clearly in Obsidian, and navigate them in a dedicated side pane.

The initial release focuses on three core capabilities:

1. **Inline review comments** with author metadata.
2. **Comments attached to highlighted text ranges**, so feedback can be anchored to a specific phrase, sentence, or paragraph.
3. **Reading view, Live Preview, and a comments pane** that together make review practical inside Obsidian.

The product is intentionally designed to preserve Markdown as the source of truth. Comments and suggestions must remain plain text, portable, Git-friendly, and editable without any external service.

A later release may add a fuller “track changes” mode that automatically records additions, deletions, and substitutions while typing. That capability is explicitly out of scope for the first implementation unless otherwise noted.

---

## 2. Problem Statement

Obsidian is strong for note-taking and knowledge management, but it does not provide a native lightweight editorial review workflow comparable to comments and suggestions in traditional word processors. Users who write drafts, collaborate asynchronously, or review text in Markdown need a review mechanism that:

- works directly in plain text,
- is readable in source form,
- is visible and navigable in the UI,
- preserves author attribution,
- does not require external infrastructure,
- and does not lock content into proprietary formats.

Existing Markdown comments are often ad hoc, hard to discover, and poorly navigable. Even when comments exist inline, users cannot easily see all feedback in one place, jump to the relevant text, or distinguish comments from normal content. In addition, generic comments are less useful when feedback must be tied to a precise span of text.

This plugin addresses those gaps by adding a structured review layer on top of Markdown using CriticMarkup-like constructs and Obsidian-native UI integration.

---

## 3. Product Vision

Enable authors, editors, and reviewers to perform focused text review inside Obsidian with the convenience of inline comments and suggestions, while preserving the simplicity, portability, and transparency of Markdown.

---

## 4. Goals

### 4.1 Primary Goals

- Enable users to add comments to Markdown notes using a structured syntax.
- Allow comments to be attached to a highlighted section of text.
- Preserve author information for comments.
- Render comments and suggestions clearly in Reading view.
- Provide useful visual decoration in Live Preview.
- Provide a dedicated comments pane for the active note.
- Keep file content plain-text and version-control-friendly.

### 4.2 Secondary Goals

- Support manual editorial marks such as addition, deletion, substitution, and highlight.
- Make review markup discoverable, navigable, and manageable.
- Provide a clear foundation for a future track-changes mode.

---

## 5. Non-Goals

The following are out of scope for the initial release:

- Real-time collaborative editing.
- Shared-user identity resolution across devices or accounts.
- Permissions, roles, or access control.
- Cloud synchronization logic.
- Conflict resolution beyond Obsidian’s existing file sync behavior.
- Automatic track changes for all editing operations.
- Whole-vault analytics or review dashboards.
- Full mobile-first optimization.
- Export to Word or Google Docs formats.
- Threaded discussions and replies.
- External comment storage separate from Markdown source.

---

## 6. Target Users

### 6.1 Primary Users

- **Writers** drafting articles, reports, documentation, or book chapters.
- **Editors** reviewing Markdown files and leaving feedback.
- **Researchers** annotating academic or technical drafts.
- **Teams using Git-backed Markdown workflows** who need review comments without leaving plain text.

### 6.2 User Characteristics

- Comfortable with Markdown or willing to learn lightweight markup.
- Value portability and transparency of source files.
- Prefer a local-first workflow.
- Need better review ergonomics inside Obsidian.

---

## 7. Core Use Cases

### UC-1: Add a general inline comment

A reviewer places the cursor in a note and inserts a review comment with author metadata.

### UC-2: Highlight text and attach a comment

A reviewer selects a sentence or phrase, invokes a command, and the plugin highlights the selected text while attaching a comment that is clearly associated with that exact span. A comment is optional (highlight mode only)

### UC-3: Review a note in Reading view

A user reads a note and can visually identify additions, deletions, substitutions, highlights, and comments.

### UC-4: Review a note in Live Preview

A user edits a note while still seeing reviewer markup in a visually useful form.

### UC-5: Navigate all comments in one place

A user opens a comments pane, sees all comments for the current note, and jumps directly to the associated text.

### UC-6: Make manual editorial suggestions

A reviewer marks text as an addition, deletion, or substitution using commands.

### UC-7: Prepare for future tracked editing

A later version may allow edits to automatically create review marks.

---

## 8. Scope by Release

## 8.1 Version 1.0

Included:

- CriticMarkup-inspired parsing.
- Manual comment insertion.
- Comments attached to selected text via highlight + comment association.
- Author configuration.
- Reading view rendering.
- Live Preview decoration.
- Comments pane for the active note.
- Navigation from pane to text location.
- Manual commands for addition, deletion, substitution, and commenting.

Excluded:

- Automatic track changes mode.
- Accept/reject workflow.
- Resolved/unresolved states.
- Comment filtering by author.
- Whole-vault comment browser.

## 8.2 Version 1.1 Candidate Scope

- Next/previous comment navigation.
- Optional author filtering.
- Resolved status for comments.
- Better multiline comment support.
- Optional hover popovers.

## 8.3 Version 2.0 Candidate Scope

- Track changes mode.
- Accept/reject single change.
- Accept/reject all changes in file.
- More advanced editor behaviors around substitutions and deletions.

---

## 9. Product Principles

- **Markdown remains the source of truth.**
- **The plugin must not hide destructive behavior behind UI abstraction.**
- **Review markup should remain understandable in raw text.**
- **The product should be useful in stages; comments first, automation later.**
- **No silent mutation of content beyond user-triggered commands.**
- **Anchored comments should feel precise and reliable.**

---

## 10. Functional Requirements

## 10.1 Syntax Support

### FR-1 Supported review syntax

The plugin shall support the following markup patterns in version 1.0:

- Addition: `{++text++}`
- Deletion: `{--text--}`
- Substitution: `{~~old~>new~~}`
- Highlight: `{==text==}`
- Comment: `{>> comment <<}`

### FR-2 Extended comment metadata

The plugin shall support author metadata for comments using an extended comment form.

**Proposed canonical v1 comment syntax:**

```md
{>> [author=Daniel] This paragraph is unclear. <<}
```

### FR-3 Anchored comment syntax

The plugin shall support comments connected to a selected text range.

**Proposed v1 canonical anchored comment form:**

```md
{==selected text==}{>> [author=Daniel] Clarify this claim. <<}
```

In version 1.0, a comment is considered attached to highlighted text when a highlight token is immediately followed by a comment token with no intervening non-whitespace content.

### FR-4 Source preservation

The plugin shall not rewrite supported markup into another persisted storage format in version 1.0.

---

## 10.2 Commands

### FR-5 Insert comment command

The plugin shall provide a command to insert a standalone comment at the cursor.

**Acceptance criteria:**

- If no text is selected, insert a comment template.
- The author field is populated from plugin settings if configured.
- Cursor placement after insertion is convenient for editing.

### FR-6 Add anchored comment to selection

The plugin shall provide a command that wraps the current selection in a highlight and appends a linked comment.

**Example transformation:**

From:

```md
The grid forecast was inaccurate.
```

To:

```md
The {==grid forecast==}{>> [author=Daniel] Be more specific about which forecast model. <<} was inaccurate.
```

**Acceptance criteria:**

- Requires a non-empty selection.
- The selected text is highlighted.
- The inserted comment is adjacent to the highlighted text.
- The author is pre-filled from settings if available.

### FR-7 Mark as addition

The plugin shall provide a command that wraps selected text in addition markup.

### FR-8 Mark as deletion

The plugin shall provide a command that wraps selected text in deletion markup.

### FR-9 Mark as substitution

The plugin shall provide a command that converts selected text into a substitution template.

### FR-10 Open comments pane

The plugin shall provide a command to open or focus the comments pane.

---

## 10.3 Reading View Rendering

### FR-11 Render supported markup in Reading view

The plugin shall visually render supported review syntax in Reading view.

**Acceptance criteria:**

- Additions are visibly distinct.
- Deletions are visibly distinct.
- Substitutions visually show the editorial relationship.
- Highlights are visually distinct.
- Comments are visible and attributable.
- Anchored comments clearly appear attached to the highlighted text.

### FR-12 Anchored comment visual association

When a highlight is immediately followed by a comment token, the UI shall make the relationship visually obvious.

Possible implementation behaviors:

- show a comment badge attached to the highlight,
- underline/highlight with comment icon,
- hover state reveals the comment,
- or inline comment chip positioned next to the highlight.

The exact visual treatment may vary, but the relationship must be explicit.

---

## 10.4 Live Preview Behavior

### FR-13 Live Preview decoration

The plugin shall visually decorate supported review syntax in Live Preview.

**Acceptance criteria:**

- Source remains editable.
- Decorated content remains selectable.
- Active editing inside markup remains possible.
- Decoration does not cause obvious cursor traps or make text editing impossible.

### FR-14 Anchored comment decoration

Highlighted text with an attached comment shall be visually distinguishable from standalone highlight markup.

### FR-15 Raw syntax accessibility

When the cursor enters or closely approaches a decorated markup region, the raw markup must remain editable and understandable.

---

## 10.5 Comments Pane

### FR-16 Current-note comments pane

The plugin shall provide a dedicated side pane listing comments for the active note.

Each comment item should include, where available:

- comment text,
- author,
- associated highlighted text snippet,
- approximate location or line number,
- nearest heading context.

### FR-17 Click-to-navigate

Clicking a comment entry shall move focus to the corresponding source location in the note.

### FR-18 Empty state

If the current note has no comments, the pane shall show a clear empty state.

### FR-19 Update on file change

The comments pane shall update when:

- the active note changes,
- the current note content changes,
- a comment is inserted or removed.

---

## 10.6 Settings

### FR-20 Author configuration

The plugin shall provide a setting for default author name.

### FR-21 Rendering toggles

The plugin shall provide toggles for:

- Reading view rendering
- Live Preview decoration

### FR-22 Persisted settings

Settings shall persist across Obsidian restarts.

---

## 11. Syntax and Grammar Specification

## 11.1 Canonical Syntax Table

| Type                | Syntax                                    | Example                                           |
| ------------------- | ----------------------------------------- | ------------------------------------------------- |
| Addition            | `{++text++}`                              | `{++new sentence++}`                              |
| Deletion            | `{--text--}`                              | `{--old sentence--}`                              |
| Substitution        | `{~~old~>new~~}`                          | `{~~weak~>strong~~}`                              |
| Highlight           | `{==text==}`                              | `{==important phrase==}`                          |
| Comment             | `{>> comment <<}`                         | `{>> Needs evidence. <<}`                         |
| Comment with author | `{>> [author=Name] comment <<}`           | `{>> [author=Daniel] Needs evidence. <<}`         |
| Anchored comment    | `{==text==}{>> [author=Name] comment <<}` | `{==claim==}{>> [author=Daniel] Cite source. <<}` |

## 11.2 Anchored Comment Interpretation Rules

A comment shall be treated as attached to a highlighted span if all of the following are true:

1. A valid highlight token exists.
2. A valid comment token directly follows it.
3. Only optional whitespace may appear between the tokens.

Example valid attachment:

```md
{==This sentence==} {>> [author=Daniel] Rephrase. <<}
```

Example not treated as attached:

```md
{==This sentence==}
Some intervening text.
{>> [author=Daniel] Rephrase. <<}
```

## 11.3 Malformed Syntax Behavior

Malformed syntax shall not be silently rewritten. In version 1.0:

- malformed markup remains plain text,
- no automatic correction is attempted,
- the comments pane ignores invalid comment structures unless they can be parsed safely.

## 11.4 Nested Syntax Policy

In version 1.0, nested CriticMarkup is not guaranteed to be supported unless explicitly tested and documented. The parser may reject nested constructs or treat them conservatively.

## 11.5 Code Block Exclusion

In version 1.0, CriticMarkup-like syntax inside fenced code blocks shall not be parsed as review markup.

---

## 12. User Experience Requirements

## 12.1 Commands

The plugin shall expose at least these commands:

- Insert Comment
- Add Comment to Selection
- Mark Selection as Addition
- Mark Selection as Deletion
- Mark Selection as Substitution
- Open Comments Pane

## 12.2 Settings UI

The settings tab shall include at least:

- Default Author Name
- Enable Reading View Rendering
- Enable Live Preview Decoration
- Color Settings for preview mode: insert, addition, deletion, comment, highlight
- Color Settings for editing mode: insert, addition, deletion, comment, highlight
-

## 12.3 Reading View UX

Reading view should prioritize clarity over literal source representation.

Recommended behavior:

- Additions appear as visually inserted content.
- Deletions appear as struck or faded content.
- Substitutions show both old and new text in a compact readable form.
- Standalone comments appear as comment chips, badges, or inline callouts.
- Anchored comments appear attached to the highlighted text they reference.

## 12.4 Live Preview UX

Live Preview should balance readability and editability.

Recommended behavior:

- Decorate supported markup with CSS classes and editor decorations.
- Do not fully hide source in ways that break editing.
- Prefer progressive disclosure when the cursor enters decorated regions.

## 12.5 Comments Pane UX

Each item should display:

- author,
- comment excerpt,
- highlighted text excerpt if applicable,
- heading context,
- and interactive navigation.

The pane should be usable as a review checklist for the active note.

---

## 13. User Stories

### US-1

As a reviewer, I want to select text and attach a comment to it so that my feedback is tied to the exact phrase I am discussing.

### US-2

As a reviewer, I want my name to be inserted automatically into comments so that authors know who left the feedback.

### US-3

As an author, I want to see all comments in one pane so that I can work through feedback systematically.

### US-4

As an editor, I want comments and suggestions to remain in plain Markdown so that the file remains portable and version-controllable.

### US-5

As a user, I want review markup to be visible in Reading view and still workable in Live Preview so that I do not have to choose between editing and reviewing.

---

## 14. Edge Cases and Behavior Rules

The implementation must define and test behavior for the following:

- Empty selection when “Add Comment to Selection” is triggered.
- Very large selections.
- Comments attached to punctuation.
- Comments inside headings.
- Comments inside list items.
- Comments inside blockquotes.
- Comments adjacent to links.
- Comments adjacent to emphasis or bold markup.
- Comments inside fenced code blocks.
- Multiline comment text.
- Multiple comments attached to the same span.
- Comment deletion leaving orphaned highlights.
- Highlight deletion leaving orphaned comments.
- Switching between files while pane is open.
- Undo/redo after command insertion.

### Version 1.0 behavioral rule for orphaned pairs

If a highlight exists without an adjacent comment, it is treated as a normal highlight.
If a comment exists without a valid preceding highlight, it is treated as a standalone comment.

---

## 15. Data Model (Conceptual)

```ts
export type CriticNode =
  | { type: 'addition'; from: number; to: number; text: string }
  | { type: 'deletion'; from: number; to: number; text: string }
  | { type: 'substitution'; from: number; to: number; oldText: string; newText: string }
  | { type: 'highlight'; from: number; to: number; text: string }
  | { type: 'comment'; from: number; to: number; text: string; author?: string }
  | {
      type: 'anchoredComment';
      from: number;
      to: number;
      highlightedText: string;
      commentText: string;
      author?: string;
      highlightRange: { from: number; to: number };
      commentRange: { from: number; to: number };
    };
```

Plugin settings:

```ts
export interface ReviewPluginSettings {
  authorName: string;
  enableReadingView: boolean;
  enableLivePreview: boolean;
}
```

This data model is conceptual and may evolve during implementation.

---

## 16. Technical Constraints

- The plugin must run locally within Obsidian Desktop.
- Source files remain standard Markdown files.
- No external backend is required.
- No external database is required.
- All rendering behavior must degrade gracefully when the plugin is disabled.
- Reading view rendering should be independent from source persistence.
- Live Preview must remain editable.

---

## 17. Quality Requirements

### 17.1 Reliability

- No silent destructive edits.
- No automatic content mutation except in response to explicit user commands.

### 17.2 Performance

- The plugin should feel responsive on typical note sizes.
- Parsing should not cause obvious lag in normal editing.
- Pane refreshes should feel near-immediate for common files.

### 17.3 Usability

- Commands must be discoverable.
- Anchored comments must be visually understandable.
- Author attribution must be obvious.

### 17.4 Maintainability

- Parser logic should be isolated from UI logic.
- Rendering logic for Reading view and Live Preview should be separated.
- Comments pane should consume structured parsed output, not scrape DOM.

---

## 18. Testing Requirements

## 18.1 Unit Tests

Must cover:

- parsing of each supported syntax type,
- author extraction,
- detection of anchored comments,
- malformed syntax handling,
- code block exclusion,
- orphaned highlight/comment behavior.

## 18.2 Integration Tests

Must cover:

- command insertion,
- settings persistence,
- comments pane generation from source,
- jump-to-location behavior,
- file switching with pane open.

## 18.3 Manual Test Matrix

Must include:

- Reading view on a note with all syntax types,
- Live Preview editing around decorated markup,
- adding anchored comments to text selections,
- lists, headings, blockquotes, links,
- large note performance,
- undo/redo behavior,
- disabling and re-enabling the plugin.

---

## 19. Risks and Open Questions

### 19.1 Risks

- Live Preview editor decorations may be more complex than Reading view rendering.
- Cursor and selection behavior near decorated tokens may be fragile.
- Multiline and nested syntax may complicate parsing.
- Future automatic track changes may risk data corruption if implemented too aggressively.

### 19.2 Open Questions

- Should multiline comments be officially supported in v1.0?
- Should hover popovers be part of v1.0 or deferred?
- Should anchored comments optionally show a badge instead of full inline text?
- Should multiple comments be attachable to the same highlighted span in v1.x?
- Should there be unique comment IDs in a future version?

---

## 20. Milestones

### Milestone 1: Parser and Fixtures

- Syntax parser
- Author parsing
- Anchored comment detection
- Unit tests and fixture files

### Milestone 2: Basic Commands and Settings

- Insert Comment
- Add Comment to Selection
- Mark Addition / Deletion / Substitution
- Settings tab

### Milestone 3: Reading View Rendering

- Render all supported syntax
- Visual treatment for anchored comments

### Milestone 4: Comments Pane

- Current-note parsing
- Listing comments
- Click-to-jump behavior

### Milestone 5: Live Preview Decoration

- Decorations for core syntax
- Safe editing around decorated content

### Milestone 6: Stabilization and Packaging

- Bug fixing
- Documentation
- Manual installation package

---

## 21. Definition of Done for Version 1.0

Version 1.0 is considered complete when all of the following are true:

- The plugin installs manually in Obsidian Desktop.
- Users can insert standalone comments.
- Users can select text and create an anchored highlighted comment.
- Supported syntax renders in Reading view.
- Supported syntax is decorated in Live Preview to a usable degree.
- The comments pane lists all current-note comments and anchored comments.
- Clicking a comment entry navigates to the associated source location.
- Default author configuration works and persists.
- Parser tests pass.
- No known severe content-loss bugs remain open.

---

## 22. Future Directions

Potential future enhancements:

- Track changes mode for typed edits.
- Accept/reject workflow.
- Resolved/unresolved comment status.
- Comment filtering and search.
- Whole-vault review navigation.
- Export workflows.
- Threaded comments.
- Structured comment IDs and references.

---

## 23. Recommended Companion Documents

This PRD is sufficient to start implementation, but the following companion documents are recommended:

1. **Technical Specification**
   - module structure
   - parser design
   - Obsidian API integration plan
   - Live Preview decoration strategy

2. **UX Notes / Wireframes**
   - comments pane layout
   - Reading view rendering examples
   - Live Preview behavior examples

3. **Test Specification**
   - syntax fixtures
   - expected parse output
   - edge case coverage

---

## 24. Appendix A: Example Content

### Standalone comment

```md
This section needs support.{>> [author=Daniel] Add a citation here. <<}
```

### Highlighted anchored comment

```md
The {==forecasting model==}{>> [author=Daniel] Specify whether this is day-ahead or intraday. <<} performed poorly.
```

### Addition

```md
This is {++new wording++} for the report.
```

### Deletion

```md
This is {--outdated wording--} in the report.
```

### Substitution

```md
This is {~~weak~>strong~~} wording.
```

---

## 25. Appendix B: Implementation Handoff Notes

If engineering starts from this PRD, the recommended first implementation path is:

1. Parser for comments, highlights, and anchored pairs.
2. Command for creating anchored comments from selected text.
3. Reading view rendering.
4. Comments pane.
5. Live Preview decoration.
6. Remaining syntax commands.

The selected-text anchored comment flow should be treated as a first-class feature, not an optional extension.
