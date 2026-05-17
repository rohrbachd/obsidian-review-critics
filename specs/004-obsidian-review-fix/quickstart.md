# Quickstart: Obsidian Review Feedback Remediation (1.1.1)

## Purpose

Validate and publish patch release `1.1.1` that resolves documented Obsidian review feedback, then prepare evidence for resubmission.

## Prerequisites

- Branch: `004-obsidian-review-fix`
- Node.js 22 installed
- npm dependencies installed
- GitHub CLI authenticated for release inspection/verification

## 1) Confirm metadata and compatibility declarations

1. Ensure `manifest.json` version is `1.1.1`.
2. Ensure `manifest.json` minimum app version is `1.7.2`.
3. Ensure `package.json` version is `1.1.1`.
4. Ensure `versions.json` contains `"1.1.1": "1.7.2"` and historical entries remain unchanged.

## 1.1) Confirm canonical review findings scope

1. Ensure `docs/review-critic-obsidian-review-fix-plan.md` includes canonical finding IDs `RF-001` through `RF-007`.
2. Confirm `RF-001` is treated as blocking and `RF-002` through `RF-007` are tracked as warning remediations.
3. Record completion evidence for each finding ID in reviewer-facing notes.

## 2) Confirm dependency and source remediation scope

1. Verify deprecated module-list dependency is removed and replacement is active.
2. Verify direct CodeMirror dependencies are declared.
3. Verify flagged source files use host-compatible helper/document-owner patterns in reviewed locations.
4. Verify no unintended behavior changes in reading, live preview, and comments pane interactions.

## 3) Run full local validation sequence

Run in order:

```powershell
npm install
npm run build
npm run check
npm run lint
npm run format:check
npm test
npm run release:check -- 1.1.1
```

Expected result: all commands pass with no blocking failures.

## 4) Publish via automation

1. Merge remediation branch to `main` after review.
2. Create and push tag `1.1.1` (no `v` prefix).
3. Confirm release workflow runs and succeeds on the tag.
4. Confirm workflow publishes exactly `main.js`, `manifest.json`, and `styles.css`.

## 5) Verify provenance evidence

1. Download each published artifact.
2. Run attestation verification for each artifact.
3. Record verification references for resubmission evidence.

## 6) Resubmission readiness checklist

1. Blocking compatibility finding (`RF-001`) is resolved.
2. Warning-level remediations (`RF-002` through `RF-007`) from the fix plan are complete.
3. Release metadata and tag values are consistent.
4. All required validation checks pass.
5. All required release assets are attested and published.
6. Reviewer-facing remediation status documentation is up to date.

## 7) Contract linkage and evidence capture

Use `specs/004-obsidian-review-fix/contracts/release-readiness.openapi.yaml` as the canonical readiness contract and capture evidence aligned to:

1. `/reviews/findings`: finding status inventory (`RF-001` through `RF-007`)
2. `/releases/{version}/compatibility`: version-to-minAppVersion mapping for `1.1.1`
3. `/releases/{version}/validate`: gate pass/fail evidence for build/check/lint/format/test/release-check
4. `/releases/{version}/artifacts/provenance`: attestation state for `main.js`, `manifest.json`, `styles.css`
5. `/releases/{version}/readiness`: final readiness decision with evidence references

## 8) Validation results (2026-05-17)

Command outcomes from this implementation cycle:

- `npm run build`: PASS
- `npm run check`: PASS
- `npm run lint`: PASS
- `npm run format:check`: FAIL
- `npm test`: PASS
- `npm run release:check -- 1.1.1`: PASS

`format:check` currently fails due broad repository-wide pre-existing formatting drift across many files outside this feature scope; no feature-specific formatter regression was introduced in release-remediation files.

## 9) Performance baseline and delta evidence (2026-05-17)

Targeted perf verification:

- `npx vitest run tests/perf/us1-track-typing-latency.perf.test.ts tests/perf/us3-pane-refresh.perf.test.ts`: PASS
- `tests/perf/us1-track-typing-latency.perf.test.ts`: threshold assertion passed (`p95 <= 50ms`)
- `tests/perf/us3-pane-refresh.perf.test.ts`: produced `artifacts/metrics/sc002-pane-refresh.json` with:
  - `tokenCount`: `50`
  - `entryCount`: `50`
  - `elapsedMs`: `1.1468`

Baseline reference for this cycle is the 2026-05-17 measurement set above; no regression beyond defined thresholds was detected in targeted perf checks.
