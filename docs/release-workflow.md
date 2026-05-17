# Release Workflow (Attested Automation)

This project publishes release assets through GitHub Actions tag workflows.

## Workflow Source

- `.github/workflows/release.yml`

## Trigger

- Push a semantic tag without `v` prefix (example: `1.1.1`).

## Required Tag and Metadata Alignment

Before publishing, the workflow enforces:

- tag matches `manifest.json.version`
- tag matches `package.json.version`
- `versions.json[version]` matches `manifest.json.minAppVersion`

If any check fails, release publication stops.

## Release Pipeline Gates

The workflow runs, in order:

1. `npm ci`
2. `npm run build`
3. `npm run check`
4. `npm run lint`
5. `npm run format:check`
6. `npm test`
7. `npm run release:check -- ${{ github.ref_name }}`

## Scoped Policy Gates (Feature 005)

For `005-release-attestation-css`, release readiness is blocked unless:

1. Attestation coverage includes required reviewer-facing assets:
   - `main.js`
   - `styles.css`
2. `scripts/check-obsidian-release.mjs` validates:
   - release asset presence for `manifest.json`, `main.js`, `styles.css`
   - release workflow provenance step presence (`actions/attest@v4`, `subject-path`)
   - required attested asset references for `main.js` and `styles.css`
3. Scoped stylesheet warning guard checks pass in:
   - `tests/unit/obsidian-bot-compliance.unit.test.ts`

## Provenance and Publication

After all gates pass:

1. Generate attestations with `actions/attest@v4` for:
   - `main.js`
   - `manifest.json`
   - `styles.css`
2. Create GitHub release using `gh release create`.
3. Upload exactly:
   - `main.js`
   - `manifest.json`
   - `styles.css`

## Local Validation Before Tag Push

Run:

```powershell
npm install
npm run build
npm run check
npm run lint
npm run format:check
npm test
npm run release:check -- 1.1.1
```

## Post-Release Verification

Verify attestations with GitHub CLI:

```powershell
gh release download 1.1.1 --repo rohrbachd/obsidian-review-critics --pattern main.js --clobber
gh attestation verify main.js -R rohrbachd/obsidian-review-critics

gh release download 1.1.1 --repo rohrbachd/obsidian-review-critics --pattern styles.css --clobber
gh attestation verify styles.css -R rohrbachd/obsidian-review-critics

gh release download 1.1.1 --repo rohrbachd/obsidian-review-critics --pattern manifest.json --clobber
gh attestation verify manifest.json -R rohrbachd/obsidian-review-critics
```
