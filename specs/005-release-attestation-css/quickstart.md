# Quickstart: Release Provenance and CSS Hygiene

## Purpose

Validate and close recommendation gaps for missing release artifact attestations (`main.js`, `styles.css`) and scoped CSS lint warnings in `styles.css`, then prepare reviewer-ready evidence.

## Prerequisites

- Branch: `005-release-attestation-css`
- Node.js 22 installed
- npm dependencies installed (`npm ci`)
- GitHub CLI authenticated for release inspection/verification

## 1) Confirm scoped recommendation targets

1. Capture provenance recommendations for missing `main.js` and `styles.css` attestations as open findings.
2. Capture scoped CSS warning targets:
   - `!important` usage at lines 127, 150, 154, 159, 168
   - duplicate selectors at lines 316, 322-323, 329, 333
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

## 6) Contract linkage

Use [release-provenance-css.openapi.yaml](./contracts/release-provenance-css.openapi.yaml) as the canonical readiness contract and map evidence to:

1. `/releases/{version}/artifacts/provenance`
2. `/stylesheets/styles.css/warnings`
3. `/releases/{version}/validate`
4. `/releases/{version}/readiness`
