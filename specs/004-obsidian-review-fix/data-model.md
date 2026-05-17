# Data Model: Obsidian Review Feedback Remediation

## Delta vs Canonical

Reference canonical baseline: [docs/data-model.md](../../docs/data-model.md)

### New entities

- `ReviewFindingRecord`
- `ReleaseCompatibilityRecord`
- `ReleaseValidationResult`
- `ReleaseArtifactProvenance`

### Changed entities

- None for existing runtime editor/token entities.

### No removals

- Existing canonical entities remain valid.

## Entity: ReviewFindingRecord

Tracks one external review finding and its remediation lifecycle.

- Fields:
  - `id`: internal stable finding identifier
  - `sourceDate`: review date associated with finding
  - `category`: `blocking | warning`
  - `locationRefs`: list of source references tied to the finding
  - `summary`: concise finding description
  - `status`: `open | fixed | waived`
  - `evidenceRefs`: links/paths proving remediation or waiver
  - `updatedAt`: last status update timestamp/date
- Validation rules:
  - `status=waived` requires at least one `evidenceRefs` entry with waiver rationale
  - `category=blocking` must not remain `open` for release-ready state

## Entity: ReleaseCompatibilityRecord

Represents one plugin version to minimum app-version compatibility mapping.

- Fields:
  - `pluginVersion`: semantic version string
  - `minAppVersion`: minimum supported app version string
  - `status`: `published | candidate`
  - `historical`: boolean indicating previously released mapping
- Validation rules:
  - `pluginVersion` must be unique within compatibility map
  - new candidate mapping cannot overwrite `historical=true` entries

## Entity: ReleaseValidationResult

Captures quality-gate outcomes for a specific release candidate/tag.

- Fields:
  - `releaseVersion`: semantic version string
  - `tagName`: release tag string
  - `checks`: list of named check outcomes (`build`, `typecheck`, `lint`, `format`, `test`, `release-asset-validation`)
  - `overallStatus`: `pass | fail`
  - `failedChecks`: list of failed check names
  - `completedAt`: completion timestamp/date
- Validation rules:
  - `overallStatus=pass` requires all required checks passing
  - `releaseVersion` must equal normalized `tagName`

## Entity: ReleaseArtifactProvenance

Represents attestation evidence for one release artifact.

- Fields:
  - `releaseVersion`: semantic version string
  - `artifactName`: `main.js | manifest.json | styles.css`
  - `attested`: boolean
  - `attestationRef`: verifier output reference or URL
  - `published`: boolean
  - `verifiedAt`: verification timestamp/date
- Validation rules:
  - `published=true` requires `attested=true`
  - each required artifact must have exactly one provenance record for release-ready status

## Lifecycle Notes

- `ReviewFindingRecord`: `open -> fixed` or `open -> waived`.
- `ReleaseValidationResult`: emitted after release candidate validation sequence; immutable for that run.
- `ReleaseArtifactProvenance`: created at release publication and verified before resubmission.

## Authoritative Stores

- Runtime review content and comments remain authoritative in vault markdown files.
- User/plugin preferences remain authoritative in plugin settings store.
- Release metadata files (`manifest.json`, `versions.json`, `package.json`) are authoritative for compatibility declarations.
- Published release assets plus attestation evidence are authoritative for provenance checks.
