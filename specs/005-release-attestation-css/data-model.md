# Data Model: Release Provenance and CSS Hygiene

## Delta vs Canonical

Reference canonical baseline: [docs/data-model.md](../../docs/data-model.md)

### New entities

- None.

### Changed entities

- None.

### No removals

- All existing canonical entities remain valid.

## Feature-Specific Entity Usage

This feature uses existing canonical entities and applies stricter readiness constraints for the current recommendation set.

## Entity: ReleaseArtifactProvenance (existing)

Represents attestation evidence per release artifact.

- Feature constraints:
  - `artifactName=main.js` and `artifactName=styles.css` MUST have `attested=true` before readiness is marked complete.
  - Provenance records used for recommendation closure MUST include traceable `attestationRef` values.

## Entity: ReleaseValidationResult (existing)

Captures validation-gate outcomes for the release candidate.

- Feature constraints:
  - Validation status is `pass` only when attestation coverage and scoped stylesheet warning remediation checks pass.
  - `failedChecks` MUST include explicit provenance or stylesheet warning categories when those checks fail.

## Entity: ReviewFindingRecord (existing)

Tracks recommendation/finding lifecycle from open to fixed.

- Feature constraints:
  - Provenance recommendation records for missing `main.js` and `styles.css` attestations transition from `open` to `fixed` only after evidence links are captured.
  - Scoped CSS warning records transition to `fixed` only when targeted warnings are reduced to zero in validation output.

## Entity: ReleaseReadinessRecord (derived from existing readiness artifacts)

Represents a derived readiness view used for reviewer evidence packaging.

- Derived from:
  - `ReleaseArtifactProvenance`
  - `ReleaseValidationResult`
  - `ReviewFindingRecord`
- Feature constraints:
  - `readyForResubmission=true` requires no open provenance recommendations and no open scoped CSS warning findings.

## Authoritative Stores

- Canonical entity definitions remain in [docs/data-model.md](../../docs/data-model.md).
- Release artifacts and their attestation evidence remain authoritative for provenance assertions.
- Recommendation/finding lifecycle evidence remains authoritative in project documentation records.
