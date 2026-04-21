# Phase 0 Research: Track Changes Workflow

## Decision 1: Track Changes edit interception model

- **Decision**: Use CodeMirror transaction interception for editor-originated text edits, then apply deterministic CriticMarkup transforms before commit.
- **Rationale**: Track Changes must react to natural typing/deletion/replacement in real time; command-only insertion is insufficient for P1 scenarios.
- **Alternatives considered**:
  - Post-edit regex reconciliation over full document: rejected due to fragility and cursor/undo side effects.
  - Manual commands only: rejected because it does not satisfy automatic tracking requirements.

## Decision 2: Addition grouping and merge behavior

- **Decision**: Continuous typing inside an addition extends the same token; adjacent additions with no original-text boundary are merged.
- **Rationale**: Prevents noisy per-keystroke tokens and keeps change review readable.
- **Alternatives considered**:
  - One token per keystroke: rejected as unreadable and hard to resolve.
  - One token per word: rejected as inconsistent with editor interaction boundaries.

## Decision 3: Deletion grouping behavior

- **Decision**: Consecutive deletion of adjacent original text merges into a single deletion token.
- **Rationale**: Mirrors addition grouping logic and reduces clutter in change panes.
- **Alternatives considered**:
  - Separate token per delete keypress: rejected due to review noise.
  - Merge only within words: rejected as arbitrary and user-surprising across punctuation.

## Decision 4: Quick-action behavior without selection

- **Decision**: Add inserts empty `{++ ++}` with cursor placed between markers; Comment inserts empty comment; Delete/Highlight/Replace perform no content change when no selection exists.
- **Rationale**: Matches clarified UX intent and avoids accidental destructive edits.
- **Alternatives considered**:
  - Insert templates for all actions: rejected by clarified requirements.
  - Disable pane buttons when no selection: rejected because Add/Comment still need cursor-mode behavior.

## Decision 5: Accepted-text display semantics

- **Decision**: Accepted-text display resolves editorial tokens (add/delete/replace) while keeping comments visible.
- **Rationale**: Users can read proposed final wording without losing unresolved feedback visibility.
- **Alternatives considered**:
  - Hide comments too: rejected because unresolved feedback can be missed.
  - Separate comment toggle in this phase: deferred to keep scope focused.

## Decision 6: Resolution scope for Phase 2

- **Decision**: Include single-change accept and reject; include accept-all; defer reject-all.
- **Rationale**: Satisfies explicit user goal while limiting high-risk bulk transform complexity.
- **Alternatives considered**:
  - Accept-only: rejected because “not accept” behavior is required.
  - Include reject-all now: deferred for risk and scope control.

## Decision 7: Theme preset duplicate handling

- **Decision**: Theme names are unique case-insensitively; duplicate save triggers overwrite-or-rename prompt.
- **Rationale**: Prevents accidental duplicates while allowing update flow.
- **Alternatives considered**:
  - Allow duplicate names: rejected due to ambiguous selection.
  - Hard reject duplicates only: rejected due to poorer user flow when intentionally updating a preset.

## Decision 8: Authoritative storage

- **Decision**: Markdown files remain authoritative for review markup; plugin settings remain authoritative for mode/theme preferences.
- **Rationale**: Aligns with existing architecture and constitution guidance on explicit source of record.
- **Alternatives considered**:
  - Separate external persistence for changes: rejected (out of scope and unnecessary).

## Decision 9: Structural Markdown handling and safe bypass

- **Decision**: Adopt a hybrid strategy that tracks inline-safe edits and bypasses structural/syntax-sensitive markdown edits (tables, headings, lists, callouts, code fences, and related block constructs) to prevent corruption.
- **Rationale**: Decoration-based transforms are reliable for inline edits but not for structural markdown semantics, especially across line boundaries.
- **Alternatives considered**:
  - Continue patching all structural edge cases ad hoc: rejected due to repeated regressions.
  - Full shadow-document editor redesign: deferred due to complexity and risk.
- **Design record**: [design-decision-markdown-structure-handling-2026-04-21.md](./design-decision-markdown-structure-handling-2026-04-21.md)
