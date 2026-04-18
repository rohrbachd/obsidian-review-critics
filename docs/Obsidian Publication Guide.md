## 1. Put the plugin in a public GitHub repository

Your repo should have at least:

- `README.md`
- `manifest.json`
- `versions.json`
- source code
- a license file

The sample plugin docs specifically call out `README.md` in the repo root before submission, and recent accepted plugin PRs include a `LICENSE` and a checklist confirming the README and release setup.

## 2. Make your first proper release on GitHub

For each release:

- bump the version in `manifest.json`
- update `versions.json`
- create a GitHub release with a **tag that exactly matches the version number**
- **do not prefix the tag with `v`**
- upload `manifest.json`, `main.js`, and `styles.css` as release assets

Obsidian’s sample plugin README is very explicit about this flow, and the community-plugin directory uses GitHub releases as the install source.

A minimal release checklist is:

manifest.json version = 0.1.0  
versions.json includes "0.1.0": "<min-app-version>"  
GitHub tag = 0.1.0  
Release assets uploaded:

- manifest.json
- main.js
- styles.css (if you use it)

That exact asset set and tag format are what Obsidian expects.

## 3. Make sure your metadata is clean

Your plugin `id` in `manifest.json` must stay stable and match the entry you later submit to `community-plugins.json`. The community directory entry needs:

- `id`
- `name`
- `author`
- `description`
- `repo`

Obsidian’s release repo documents those required fields directly.

## 4. Self-review against Obsidian’s policies before submitting

Obsidian has:

- general **Developer policies**
- plugin-specific **Submission requirements**
- **Plugin guidelines** with common review pitfalls

Recent submission PRs also show the current checklist reviewers expect, including:

- tested on relevant platforms
- GitHub release contains required files
- release tag exactly matches `manifest.json`
- README clearly explains usage
- license added
- compatibility with third-party code licenses
- policy review completed by the author

For your plugin, I would pay special attention to:

- no unnecessary network usage or telemetry
- clear disclosure in the README if the plugin reads external files, uses accounts, or sends data
- no hardcoded styling that overrides Obsidian broadly
- mobile compatibility if `isDesktopOnly` is `false`
- production build quality and load-time impact

## 5. Submit it to the official Community Plugins list

Once your first release is live:

- fork `obsidianmd/obsidian-releases`
- add your plugin entry to the end of `community-plugins.json`
- open a PR
- fill out the submission checklist in the PR template

That is the official submission path described by Obsidian, and the live accepted PRs show the checklist reviewers currently expect.

## 6. Optional: do a beta first

Before formal submission, you can publish GitHub releases and ask testers to install using **BRAT**. Obsidian explicitly mentions BRAT as the recommended way to get beta testers before “official” browser submission.

---

## The practical sequence I’d use for your plugin

1. Clean up repo name, plugin name, README, screenshots/GIFs.
2. Add `LICENSE`.
3. Set final `manifest.json` values: `id`, `name`, `version`, `minAppVersion`, description, maybe `fundingUrl`.
4. Create first production build.
5. Create GitHub release `0.1.0` with `manifest.json`, `main.js`, `styles.css`.
6. Test manual install from the release assets on a fresh vault.
7. Optionally run a short BRAT beta.
8. Submit PR to `obsidianmd/obsidian-releases`.
