# Obsidian Publication Checklist

Use this checklist before submitting to `obsidianmd/obsidian-releases`.

## Repository and Metadata

- [ ] Public GitHub repository
- [ ] Root files present: `README.md`, `manifest.json`, `versions.json`, `LICENSE`
- [ ] Stable plugin id in `manifest.json` (`review-critic`)
- [ ] `manifest.json` and `versions.json` version mapping match

## Quality Gates

- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run release:check -- <version>`
- [ ] Follow [release workflow](docs/release-workflow.md)

## Release

- [ ] Create Git tag exactly equal to version (`0.1.0`, not `v0.1.0`)
- [ ] Push tag and let `.github/workflows/release.yml` create the release automatically
- [ ] Confirm release assets uploaded by workflow:
  - `manifest.json`
  - `main.js`
  - `styles.css`
- [ ] Verify artifact attestations for uploaded assets (`gh attestation verify ...`)
  - [ ] Required recommendation closure assets verified: `main.js`, `styles.css`
  - [ ] Timed provenance verification evidence captured (target: <= 10 minutes)

## Submission PR (`obsidianmd/obsidian-releases`)

- [ ] Add plugin entry in `community-plugins.json` with:
  - `id`
  - `name`
  - `author`
  - `description`
  - `repo`
- [ ] Complete submission checklist in PR template
- [ ] Confirm README usage instructions are clear for end users
