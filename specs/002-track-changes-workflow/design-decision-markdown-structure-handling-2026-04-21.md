# Design Decision: Markdown-Structure Handling in Track Changes

Date: 2026-04-21
Spec: 002-track-changes-workflow
Status: Accepted (implementation planned)

## Context

Recent defects show a consistent pattern:

- Inline CriticMarkup tracking works reasonably for plain text edits.
- Structural Markdown edits (tables, headings, lists, fenced code, callouts, separators, footnotes, block math) cause rendering mismatch or editor range errors when transformed as inline CriticMarkup.
- Replacement (`{~~old~>new~~}`) active editing visuals are inconsistent (full-token strike-through, weak old/new color split when cursor is inside token).

The plugin currently relies on CodeMirror decorations. Decorations can style/hide text but cannot reliably transform Markdown parser structure, especially across line breaks.

## Key Constraints

1. CodeMirror plugin decorations must not perform line-break-replacing transforms in ways that break editor invariants.
2. Hidden delimiters do not change Markdown syntax parsing; they only change visuals.
3. Structural Markdown semantics (heading/list/table/code fence/callout) depend on raw source line starts and block boundaries.
4. Existing table bypass is now stable and must not regress.

## Options Considered

### Option A: Keep current inline-only approach and patch issues one-by-one

Pros:

- Minimal short-term coding.

Cons:

- High regression risk.
- Repeated edge-case failures across block constructs.
- Does not address structural mismatch root cause.

### Option B: Stability-first hybrid model (chosen)

Pros:

- Preserves current reliable inline behavior.
- Avoids structural corruption and range mapping failures.
- Scales by explicit compatibility matrix.

Cons:

- Some Markdown formatting/structure edits remain intentionally untracked in Track Changes mode.

### Option C: Full model redesign with shadow document + mapped editable projection

Pros:

- Could eventually render all accepted/track views with perfect Markdown semantics.

Cons:

- Large complexity, high risk, effectively a new editor layer.
- Not suitable as immediate stabilization step.

## Decision

Adopt **Option B (stability-first hybrid model)**.

### Decision 1: Keep canonical CriticMarkup substitution syntax

- Keep `{~~old~>new~~}`.
- Reject alternate syntax proposals like `{~~old~~>++new++}` for now.

Reason:

- Current parser, resolver, pane logic, and test fixtures are built around standard CriticMarkup.
- Syntax change would introduce broad compatibility and migration risk without solving structural Markdown constraints.

### Decision 2: Two edit classes

1. **Inline-safe edits**: keep current tracked transform logic.
2. **Structural/syntax-sensitive edits**: bypass auto-track transform (same principle as tables).

### Decision 3: Structural/syntax-sensitive edits list (initial)

Treat as bypass candidates when affected by tracked transaction:

- Tables
- Fenced code blocks (``` / ~~~)
- Block math (`$$` blocks)
- Headings (`#` at start of line)
- Ordered/unordered/task lists
- Blockquotes and callouts (`>` and `> [!...]`)
- Horizontal rules (`---`, `***`, `___`)
- Footnote definitions and references
- Link/image syntax edits (`[]()`, `![]()`, wiki links)
- Frontmatter boundaries (`---` at top)

### Decision 4: Replacement active-state rendering

For substitution tokens in live preview active edit mode:

- Render old/new spans with explicit split styling even while cursor is inside token.
- Ensure strike-through only applies to old side.
- Do not allow entire token to inherit markdown strike-through visual.

## Compatibility Matrix

- Plain inline text insert/delete/replace: tracked with CriticMarkup.
- Inline edits inside addition/new-side substitution/comment body: tracked or plain-edit according to existing guarded rules.
- Table cell edits: bypass tracking (already stable behavior to preserve).
- Heading/list/code/callout/hr/footnote/link structural edits: bypass tracking (new planned parity with table strategy).
- Markdown format-toggle commands (bold/italic/strikethrough/inline code):
  - Phase 1-2: bypass tracking when change is syntax-dominant.
  - Future optional phase: experimental semantic formatting-tracking mode.

## Implementation Plan

### Phase 1: Rendering stabilization (low risk)

1. Refactor substitution decoration builder to always produce deterministic, sorted ranges for old/new/delimiters.
2. In active-token state, style substitution old/new segments explicitly instead of whole-token strike-through behavior.
3. Add regression tests for active substitution visuals and delimiter behavior.

### Phase 2: Structural edit bypass classifier

1. Add line-context classifier in track transaction filter.
2. Reuse table bypass pattern for all structural/syntax-sensitive classes above.
3. Add unit tests for each class and integration tests for mixed documents.
4. Preserve existing table behavior as locked baseline.

### Phase 3: Non-corrupting UX feedback for bypassed edits

1. Add a small non-blocking notice once per session: structural markdown edits are not auto-tracked.
2. Add optional pane marker type: "untracked structural edit" (metadata only, no source markup mutation).

### Phase 4 (optional, experimental): Formatting-change tracking

1. Evaluate separate representation for formatting-only changes.
2. Keep behind a feature flag.
3. Require dedicated regression suite before default enablement.

## Test Strategy

1. Expand fixture coverage for mixed-content notes:
   - headings + lists + tables + callouts + code fences + footnotes + links.
2. Add randomized edit-sequence tests around bypass boundaries.
3. Add invariant checks:
   - no out-of-range positions,
   - no unsorted decoration ranges,
   - no unexpected changes outside edited region.
4. Keep current table scenarios as mandatory non-regression tests.

## Safety Requirements

1. Never transform transactions that can alter line-structure semantics unpredictably.
2. Prefer "skip tracking" over "attempt transformation" when uncertain.
3. Preserve raw user content over visual tracking completeness.

## Notes for README and UX copy

Document explicitly:

- Track Changes is currently optimized for inline editorial text changes.
- Structural Markdown edits are intentionally protected to avoid content corruption.
- Tables are included in the structural-protected set.
