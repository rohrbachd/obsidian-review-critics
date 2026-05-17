# Phase 0 Research: Obsidian Review Feedback Remediation

## Decision 1: Resolve compatibility blocker by raising declared minimum app version

- **Decision**: Keep existing API usage and update patch release metadata to declare minimum supported Obsidian version `1.7.2`.
- **Rationale**: The blocker is a metadata/API mismatch; aligning declaration with actual API requirements is the lowest-risk fix for behavior and review acceptance.
- **Alternatives considered**:
  - Replace the API usage with older fallback patterns to preserve `1.5.0`: rejected due to higher regression risk and broader behavior testing burden.
  - Ship a warning-only workaround without metadata correction: rejected because blocker remains unresolved.

## Decision 2: Remove deprecated `builtin-modules` dependency in favor of platform-native modules list

- **Decision**: Use Node’s native module list source rather than third-party replacement dependency.
- **Rationale**: Reduces dependency surface and aligns with reviewer guidance while preserving bundler externalization behavior.
- **Alternatives considered**:
  - Keep `builtin-modules` unchanged: rejected due to explicit review warning.
  - Replace with another third-party shim: rejected because native platform support is available.

## Decision 3: Declare CodeMirror packages as direct runtime dependencies

- **Decision**: Add direct dependency declarations for the review-flagged CodeMirror packages already consumed by plugin modules.
- **Rationale**: Ensures dependency metadata accurately reflects runtime imports and satisfies review dependency checks.
- **Alternatives considered**:
  - Rely on transitive dependencies only: rejected because tooling/review checks require direct declaration.
  - Inline internal wrappers to avoid direct imports: rejected as unnecessary scope increase.

## Decision 4: Standardize document/element access through Obsidian-compatible helpers

- **Decision**: Replace flagged direct global document usage with host-compatible helper/document-owner patterns in flagged files.
- **Rationale**: Reduces popout-window incompatibility risk while preserving rendering semantics.
- **Alternatives considered**:
  - Keep direct global document references with isolated suppressions: rejected due to repeat warning risk.
  - Large rendering refactor of all view modules: rejected as out-of-scope for patch remediation.

## Decision 5: Enforce release provenance through tag-triggered automated workflow

- **Decision**: Add a dedicated release workflow that validates version/tag consistency, runs quality gates, generates attestations, and publishes required assets.
- **Rationale**: Satisfies review provenance expectations and prevents manual-release drift.
- **Alternatives considered**:
  - Manual local release uploads: rejected because provenance guarantees are weaker and error-prone.
  - CI-only checks without release publishing: rejected because reviewer expects attested published assets.

## Decision 6: Treat resubmission readiness as evidence-backed gate

- **Decision**: Require evidence across three dimensions before resubmission: metadata correctness, warning remediation, and attested artifact publication.
- **Rationale**: Prevents partial fixes and repeated review loops.
- **Alternatives considered**:
  - Resubmit after blocker-only fix: rejected due to unresolved warning backlog and likely follow-up churn.
  - Defer provenance to later release: rejected because provenance warnings are part of current review feedback.
