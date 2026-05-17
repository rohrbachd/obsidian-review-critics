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

1. Blocking compatibility finding is resolved.
2. Warning-level remediations from the fix plan are complete.
3. Release metadata and tag values are consistent.
4. All required validation checks pass.
5. All required release assets are attested and published.
6. Reviewer-facing remediation status documentation is up to date.
