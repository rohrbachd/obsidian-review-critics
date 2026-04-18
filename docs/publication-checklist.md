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
- [ ] Create GitHub release for the matching tag
- [ ] Upload release assets:
  - `manifest.json`
  - `main.js`
  - `styles.css`

## Submission PR (`obsidianmd/obsidian-releases`)

- [ ] Add plugin entry in `community-plugins.json` with:
  - `id`
  - `name`
  - `author`
  - `description`
  - `repo`
- [ ] Complete submission checklist in PR template
- [ ] Confirm README usage instructions are clear for end users
