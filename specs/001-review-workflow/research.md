# Phase 0 Research: Obsidian Review Workflow v1

## Decision 1: Parsing Strategy and Token Authority

- Decision: Use deterministic regex-driven token extraction over markdown source, with explicit post-processing for anchored comment pairing.
- Rationale: Review syntax is domain-specific and compact; deterministic extraction is simpler to validate and maintain for v1 than introducing a full grammar parser.
- Alternatives considered:
  - Full parser combinator/grammar implementation: rejected for v1 due to complexity and slower iteration.
  - DOM scraping-based interpretation: rejected because source markdown must remain the authority.

## Decision 2: Anchored Comment Rule

- Decision: A comment is anchored only when a highlight token is immediately followed by a comment token with optional whitespace.
- Rationale: Matches PRD and reduces ambiguous many-to-one mapping logic.
- Alternatives considered:
  - Proximity-based matching across lines/paragraphs: rejected due to ambiguity and navigation instability.

## Decision 3: Nested CriticMarkup Behavior

- Decision: Treat nested CriticMarkup syntax as plain text in v1.
- Rationale: Clarified in spec session; avoids parser ambiguity and reduces corruption risk.
- Alternatives considered:
  - Recursive nested parsing: rejected for v1 due to complexity and unclear UX behavior.
  - Outer-token-only parse with partial inner handling: rejected as inconsistent and harder to explain to users.

## Decision 4: Live Preview Rendering Approach

- Decision: Use CodeMirror decoration marks only, without hidden text replacement.
- Rationale: Keeps editing reliable and avoids cursor traps while still providing visual cues.
- Alternatives considered:
  - Replacing source text with widgets: rejected due to editability and selection risks.

## Decision 5: Comments Pane Data Source

- Decision: Build pane entries from parsed source text on active note events (`file-open`, `modify`, active-leaf changes).
- Rationale: Ensures pane reflects current source and remains local-first.
- Alternatives considered:
  - Cached indexed store for all notes: rejected for v1 because whole-vault scope is non-goal.

## Decision 6: API Contract Format for Planning

- Decision: Provide an OpenAPI-style local contract documenting plugin commands and pane refresh/navigation operations.
- Rationale: Gives implementation and testing teams an explicit contract artifact even though plugin is local and command-driven.
- Alternatives considered:
  - No contract artifact: rejected because plan workflow requires `/contracts/` output and explicit operation definitions.
