# Phase 0 Research: Release Provenance and CSS Hygiene

## Decision 1: Treat required asset attestation as release-readiness gate input

- **Decision**: Require explicit attestation evidence for required published assets and treat any missing asset attestation as release-readiness failure.
- **Rationale**: The review recommendations identify attestation gaps directly, so readiness cannot be considered complete without per-asset coverage.
- **Alternatives considered**:
  - Advisory-only provenance checks: rejected because recommendations remained unresolved in prior publication output.
  - Manual post-release spot checks without gating: rejected due to repeatability and auditability risk.

## Decision 2: Keep provenance verification workflow documentation as first-class evidence

- **Decision**: Document deterministic maintainer verification steps and evidence capture requirements for attested artifacts.
- **Rationale**: Recommendations are closed only when maintainers can reproduce verification and show references in resubmission material.
- **Alternatives considered**:
  - Rely on release job logs only: rejected because logs alone are weaker as reviewer-facing evidence.
  - Defer documentation updates to a later cycle: rejected due to immediate resubmission needs.

## Decision 3: Remove scoped `!important` usage through selector precedence and variable-safe styling

- **Decision**: Refactor the flagged stylesheet regions to avoid `!important` by using stable selector hierarchy and existing CSS variable pathways.
- **Rationale**: This resolves warnings while preserving maintainability and minimizing unintended style override collisions.
- **Alternatives considered**:
  - Keep `!important` and suppress lint warnings: rejected because warning debt remains unresolved.
  - Global selector rewrites across the entire stylesheet: rejected as unnecessary scope expansion.

## Decision 4: Consolidate duplicate selector blocks into single canonical declarations

- **Decision**: Merge duplicate selector definitions for the flagged review controls into one declaration per selector group.
- **Rationale**: Eliminates lint warnings and reduces conflicting rule maintenance burden.
- **Alternatives considered**:
  - Retain duplicates with comments: rejected because warnings persist and maintenance remains error-prone.
  - Introduce entirely new class naming for all controls: rejected as disproportionately invasive.

## Decision 5: Validate visual behavior through targeted regression checks after CSS cleanup

- **Decision**: Re-run existing integration and rendering-focused tests tied to comments, quick actions, and tracked changes after stylesheet adjustments.
- **Rationale**: The feature must avoid UI regressions while resolving lint warnings.
- **Alternatives considered**:
  - Accept lint-only validation: rejected because lint pass alone cannot guarantee behavioral stability.
  - Full end-to-end manual validation only: rejected due to lower repeatability and slower feedback.
