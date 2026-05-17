# Quickstart: Release Provenance and CSS Hygiene

## Purpose

Validate and close recommendation gaps for missing release artifact attestations (`main.js`, `styles.css`) and scoped CSS lint warnings in `styles.css`, then prepare reviewer-ready evidence.

## Prerequisites

- Branch: `005-release-attestation-css`
- Node.js 22 installed
- npm dependencies installed (`npm ci`)
- GitHub CLI authenticated for release inspection/verification

## 1) Confirm scoped recommendation targets

1. Capture provenance recommendations for missing `main.js` and `styles.css` attestations as open findings:
   - `R-ATTEST-001`: `main.js` missing artifact attestation
   - `R-ATTEST-002`: `styles.css` missing artifact attestation
2. Capture scoped CSS warning targets:
   - `R-CSS-001`: `!important` usage in `styles.css` for substitution decorations
   - `R-CSS-002`: duplicate selector `.review-changes-toolbar`
   - `R-CSS-003`: duplicate selector `.review-quick-actions-row,.review-changes-controls-row`
   - `R-CSS-004`: duplicate selector `.review-track-toggle`
   - `R-CSS-005`: duplicate selector `.review-pane-separator`
3. Confirm no additional recommendations are bundled into this feature scope.

## 2) Apply and verify stylesheet warning remediation

1. Refactor `styles.css` to remove targeted `!important` usage by selector precedence and variable-safe declarations.
2. Consolidate duplicate selector blocks into single canonical declarations for each flagged selector group.
3. Run lint/validation commands and verify the scoped warning set is zero.

## 3) Validate release automation and metadata gates

Run in order:

```powershell
npm run build
npm run check
npm run lint
npm run format:check
npm test
npm run release:check -- <version>
```

Expected result: all commands pass with no blocking failures.

## 4) Publish and verify attested assets

1. Merge feature changes to `main` after review.
2. Create and push release tag `<version>` (no `v` prefix).
3. Confirm release workflow success.
4. Confirm release assets include `main.js`, `manifest.json`, and `styles.css`.
5. Verify `main.js` and `styles.css` attestation evidence is present and verifiable.

## 5) Collect evidence for recommendation closure

Record evidence references for:

1. Scoped CSS warning set reduced to zero.
2. Asset provenance verification for `main.js`.
3. Asset provenance verification for `styles.css`.
4. Final release readiness decision showing no open provenance/CSS warnings in scope.

## 5.1) Timed provenance verification evidence (NFR-002 / SC-002)

1. Use baseline comparison against the latest successful `main` branch CI run.
2. Measure elapsed wall-clock time from first `gh release download` command to final successful `gh attestation verify styles.css`.
3. Record:
   - start timestamp
   - end timestamp
   - total elapsed minutes
4. Pass criterion: elapsed time `<= 10` minutes.

## 6) Contract linkage

Use [release-provenance-css.openapi.yaml](./contracts/release-provenance-css.openapi.yaml) as the canonical readiness contract and map evidence to:

1. `/releases/{version}/artifacts/provenance`
2. `/stylesheets/styles.css/warnings`
3. `/releases/{version}/validate`
4. `/releases/{version}/readiness`

## 7) Baseline regression reference

For regression assertions in this feature:

1. Baseline source: latest successful `main` branch CI run for:
   - `tests/integration/us3-rendering.integration.test.ts`
   - `tests/unit/reading-view.unit.test.ts`
   - `tests/unit/comments-view.unit.test.ts`
2. Feature run must report zero new failures relative to that baseline.

## 8) Validation outcomes (2026-05-17)

Command outcomes for this implementation cycle:

- `npm run build`: PASS
- `npm run check`: PASS
- `npm run lint`: PASS
- `npm run test`: PASS
- `npm run release:check -- 2.0.0`: PASS
- `npm run format:check`: FAIL

`format:check` fails because of broad pre-existing repository formatting drift outside this feature scope. Targeted feature files were formatted and pass local lint/test/release-check gates.

## 9) Timed provenance verification evidence status

- Baseline source for comparison: latest successful `main` branch CI run.
- Local branch status: release tag workflow has not been executed from this branch, so `gh release download` + `gh attestation verify` timing evidence cannot be finalized yet.
- Required follow-up after tagged release:
  1. Record start/end timestamps for `main.js` and `styles.css` verification steps.
  2. Compute total elapsed minutes.
  3. Confirm elapsed time `<= 10` minutes and append evidence references.
