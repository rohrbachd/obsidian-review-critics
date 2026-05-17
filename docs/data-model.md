# Canonical Data Model Baseline

This document defines the canonical conceptual model for review workflow features in this repository.

## Entity: ReviewToken

- Fields:
  - `type`: one of `addition`, `deletion`, `substitution`, `highlight`, `comment`, `anchoredComment`
  - `from`: source start offset (inclusive)
  - `to`: source end offset (exclusive)
- Variant fields:
  - Addition/Deletion/Highlight: `text`
  - Substitution: `oldText`, `newText`
  - Comment: `text`, optional `author`
  - AnchoredComment: `highlightedText`, `commentText`, optional `author`, `highlightRange`, `commentRange`

## Entity: CommentPaneEntry

- Fields:
  - `id`
  - `from`
  - `to`
  - `line`
  - `heading`
  - `commentText`
  - optional `author`
  - optional `highlightedText`
  - optional `isAnchored`
  - optional `canResolve`

## Entity: TrackedChangeEntry

- Fields:
  - `id`
  - `type` (`addition` | `deletion` | `substitution`)
  - `from`
  - `to`
  - `line`
  - `heading`
  - optional `text`
  - optional `oldText`
  - optional `newText`

## Entity: QuickActionRequest

- Fields:
  - `action` (`add` | `delete` | `highlight` | `replace` | `comment`)
  - `hasSelection`
  - optional `selectionText`
  - `cursorOffset`

## Entity: ThemePreset

- Fields:
  - `id`
  - `name` (case-insensitive unique)
  - `previewColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)
  - `editingColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)
  - `previewTextColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)
  - `editingTextColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)
  - `isBuiltIn`

## Entity: ThemePresetRegistry

- Fields:
  - `presets` (`ThemePreset[]`)
  - optional `activePresetId`

## Entity: ReviewPluginSettings

- Fields:
  - `authorName`
  - `enableReadingView`
  - `enableLivePreview`
  - `trackChangesEnabled`
  - `acceptedTextViewEnabled`
  - optional `activeThemePresetId`
  - `themePresets` (`ThemePreset[]`)
  - `previewColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)
  - `editingColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)
  - `previewTextColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)
  - `editingTextColors` (`insert`, `addition`, `deletion`, `comment`, `highlight`)

## Source of Record

- Markdown files in the vault are the source of record for review markup and comment content.
- Plugin settings store is the source of record for user preferences.

## Entity: ComplianceGuardRule

- Fields:
  - `id`
  - `source` (`official-lint` | `local-regression-test`)
  - `scopePattern` (for example `src/**/*.ts`)
  - `assertion`
  - optional `allowlist` (with justification)
  - `severity` (`blocking` | `warning`)
  - `enabled`

## Entity: BotFindingStatus

- Fields:
  - `findingId`
  - `externalReference`
  - `category`
  - `status` (`open` | `fixed` | `waived`)
  - optional `waiverRationale`
  - `updatedAt`

## Entity: ComplianceGateResult

- Fields:
  - `runId`
  - `ruleResults`
  - `blockingFailures`
  - `warnings`
  - `finalStatus` (`pass` | `fail`)
  - `releaseEligible`

## Entity: ReviewFindingRecord

- Fields:
  - `id`
  - `sourceDate`
  - `category` (`blocking` | `warning`)
  - `locationRefs`
  - `summary`
  - `status` (`open` | `fixed` | `waived`)
  - `evidenceRefs`
  - `updatedAt`

## Entity: ReleaseCompatibilityRecord

- Fields:
  - `pluginVersion`
  - `minAppVersion`
  - `status` (`published` | `candidate`)
  - `historical`

## Entity: ReleaseValidationResult

- Fields:
  - `releaseVersion`
  - `tagName`
  - `checks`
  - `overallStatus` (`pass` | `fail`)
  - `failedChecks`
  - `completedAt`

## Entity: ReleaseArtifactProvenance

- Fields:
  - `releaseVersion`
  - `artifactName` (`main.js` | `manifest.json` | `styles.css`)
  - `attested`
  - `attestationRef`
  - `published`
  - `verifiedAt`
