# Review & Critic — Obsidian Plugin Review Fix Plan

Prepared: 2026-05-17

Repository:

```text
https://github.com/rohrbachd/obsidian-review-critics
```

Target release:

```text
1.1.1
```

Previous failed review:

```text
Date: May 7, 2026
Version: 1.1.0
Commit: 80f713b
Status: Failed
```

## Summary

The Obsidian Community Plugin review for `Review & Critic` failed because the plugin uses an Obsidian API that requires a newer minimum Obsidian version than the one declared in `manifest.json`.

The hard error is:

```text
'Workspace.revealLeaf' requires Obsidian v1.7.2, but minAppVersion is 1.5.0.
src/main.ts:388
src/main.ts:406
```

The simplest and lowest-risk fix is to keep using `Workspace.revealLeaf` and raise the plugin's `minAppVersion` to `1.7.2` in the next release.

There are also warnings about:

- missing GitHub artifact attestations for `main.js` and `styles.css`,
- replacing `builtin-modules`,
- using Obsidian DOM helpers instead of raw `document.createElement`,
- popout compatibility,
- adding direct CodeMirror dependencies,
- replacing some `createEl('div')` calls with `createDiv()`.

Because Obsidian says review feedback should be addressed with a new incremented release version, do this as release `1.1.1`, not by editing or replacing the existing `1.1.0` release.

## Canonical Findings Baseline (2026-05-07)

Use this baseline as the authoritative remediation and evidence checklist for this release:

- `RF-001` (blocking): `Workspace.revealLeaf` requires Obsidian `1.7.2` while `minAppVersion` is `1.5.0`.
- `RF-002` (warning): missing artifact attestations for `main.js` and `styles.css`.
- `RF-003` (warning): deprecated `builtin-modules` usage.
- `RF-004` (warning): direct CodeMirror dependency declarations missing.
- `RF-005` (warning): flagged `createEl('div', ...)` usage where `createDiv(...)` is expected.
- `RF-006` (warning): direct global `document` usage and raw DOM creation patterns in flagged rendering paths.
- `RF-007` (warning): popout compatibility risk from document ownership assumptions.

## Remediation Status Tracker

| Finding | Severity | Status      | Evidence                                                                                                                                                                         |
| ------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-001  | blocking | Resolved    | `manifest.json` now declares `version: 1.1.1` and `minAppVersion: 1.7.2`; `versions.json` includes `"1.1.1": "1.7.2"`; `package.json` version aligned to `1.1.1`.                |
| RF-002  | warning  | In Progress | Pending attested release workflow execution and post-release verification evidence.                                                                                              |
| RF-003  | warning  | Resolved    | `esbuild.config.mjs` now imports `builtinModules` from `node:module`; `builtin-modules` removed from dependencies.                                                               |
| RF-004  | warning  | Resolved    | `@codemirror/state` and `@codemirror/view` are direct dependencies in `package.json`.                                                                                            |
| RF-005  | warning  | Resolved    | Flagged `createEl('div', ...)` calls migrated to `createDiv(...)` in `src/comments-view.ts`.                                                                                     |
| RF-006  | warning  | Resolved    | Flagged direct global `document` DOM creation patterns replaced with helper APIs in `src/live-preview.ts` and `src/reading-view.ts`; root styling path updated in `src/main.ts`. |
| RF-007  | warning  | Resolved    | Rendering traversal now uses owner-document-safe tree walker in `src/reading-view.ts`; popout compatibility coverage added in integration tests.                                 |

## Feature 005 Recommendation Closure Mapping (2026-05-17)

| Recommendation ID | Scope                                                                       | Status      | Evidence Target                                                                                      |
| ----------------- | --------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| R-ATTEST-001      | `main.js` artifact attestation missing                                      | In Progress | `.github/workflows/release.yml` attestation subject-path + `gh attestation verify main.js` output    |
| R-ATTEST-002      | `styles.css` artifact attestation missing                                   | In Progress | `.github/workflows/release.yml` attestation subject-path + `gh attestation verify styles.css` output |
| R-CSS-001         | `!important` usage warnings in `styles.css`                                 | Resolved    | `styles.css` substitution declarations no longer use `!important`; scoped warning assertions pass    |
| R-CSS-002         | Duplicate selector `.review-changes-toolbar`                                | Resolved    | `styles.css` keeps a single `.review-changes-toolbar` block; scoped warning assertions pass          |
| R-CSS-003         | Duplicate selector `.review-quick-actions-row,.review-changes-controls-row` | Resolved    | `styles.css` keeps a single combined selector block; scoped warning assertions pass                  |
| R-CSS-004         | Duplicate selector `.review-track-toggle`                                   | Resolved    | `styles.css` keeps a single `.review-track-toggle` block; scoped warning assertions pass             |
| R-CSS-005         | Duplicate selector `.review-pane-separator`                                 | Resolved    | duplicate `.review-pane-separator` block removed; scoped warning assertions pass                     |

## High-level plan

1. Create a fix branch.
2. Bump plugin version from `1.1.0` to `1.1.1`.
3. Raise `minAppVersion` from `1.5.0` to `1.7.2`.
4. Update `versions.json`.
5. Fix the source-code warnings.
6. Add direct dependencies for CodeMirror packages.
7. Replace `builtin-modules` with Node's native `builtinModules`.
8. Add a GitHub Actions release workflow that builds, attests, and uploads release assets.
9. Run all local checks.
10. Merge to `main`.
11. Push tag `1.1.1`.
12. Let GitHub Actions create the release assets and attestations.
13. Refresh/resubmit the Obsidian Community Plugin review.

---

# 1. Create a fix branch

From your local clone:

```powershell
git checkout main
git pull
git checkout -b fix/obsidian-review-feedback-1.1.1
```

---

# 2. Update versions

## `manifest.json`

Change `version` to `1.1.1`.

Change `minAppVersion` to `1.7.2`.

Expected result:

```json
{
  "id": "review-critic",
  "name": "Review & Critic",
  "version": "1.1.1",
  "minAppVersion": "1.7.2",
  "description": "Review and CriticMarkup-style comments for markdown notes.",
  "author": "Daniel Rohrbach",
  "isDesktopOnly": false
}
```

## `package.json`

Change:

```json
"version": "1.1.0"
```

to:

```json
"version": "1.1.1"
```

## `versions.json`

Add a new entry:

```json
"1.1.1": "1.7.2"
```

Do **not** change the old entries.

Example:

```json
{
  "0.1.0": "1.5.0",
  "0.2.0": "1.5.0",
  "0.3.0": "1.5.0",
  "0.3.1": "1.5.0",
  "1.0.0": "1.5.0",
  "1.0.1": "1.5.0",
  "1.1.0": "1.5.0",
  "1.1.1": "1.7.2"
}
```

Reason: `1.1.0` was already published with `minAppVersion: 1.5.0`. Keep historical mappings intact. The new release `1.1.1` declares the actual minimum required version.

---

# 3. Replace `builtin-modules`

The review warning says:

```text
"builtin-modules" should be replaced with an alternative package.
package.json:41
```

Your `esbuild.config.mjs` currently imports `builtin-modules`.

Change this:

```js
import builtins from 'builtin-modules';
```

to:

```js
import { builtinModules } from 'node:module';
```

Then change this:

```js
...builtins,
```

to:

```js
...builtinModules,
```

Then remove the dependency:

```powershell
npm uninstall builtin-modules
```

This updates both `package.json` and `package-lock.json`.

---

# 4. Add direct CodeMirror dependencies

The review says:

```text
'@codemirror/state' should be listed in the project's dependencies.
src/live-preview.ts:1
src/track-changes.ts:1

'@codemirror/view' should be listed in the project's dependencies.
src/live-preview.ts:2
```

Install them as direct dependencies:

```powershell
npm install --save @codemirror/state @codemirror/view
```

Keep them externalized in `esbuild.config.mjs`. They can still remain in the `external` list.

---

# 5. Fix `comments-view.ts` DOM helper warnings

The review wants `createDiv()` for div elements instead of `createEl('div', ...)`.

In `src/comments-view.ts`, replace the flagged calls.

## Before

```ts
const list = root.createEl('div', { cls: 'review-comments-list' });
```

## After

```ts
const list = root.createDiv({ cls: 'review-comments-list' });
```

## Before

```ts
const heading = item.createEl('div', { cls: 'review-comments-item-heading' });
```

## After

```ts
const heading = item.createDiv({ cls: 'review-comments-item-heading' });
```

## Before

```ts
item.createEl('div', {
  cls: 'review-comments-item-body',
  text: `Comment: ${entry.commentText || ReviewCommentsPaneText.EMPTY_COMMENT}`,
});
```

## After

```ts
item.createDiv({
  cls: 'review-comments-item-body',
  text: `Comment: ${entry.commentText || ReviewCommentsPaneText.EMPTY_COMMENT}`,
});
```

## Before

```ts
item.createEl('div', {
  cls: 'review-comments-item-snippet',
  text: `${ReviewCommentsPaneText.SNIPPET_PREFIX}${entry.highlightedText}${ReviewCommentsPaneText.SNIPPET_SUFFIX}`,
});
```

## After

```ts
item.createDiv({
  cls: 'review-comments-item-snippet',
  text: `${ReviewCommentsPaneText.SNIPPET_PREFIX}${entry.highlightedText}${ReviewCommentsPaneText.SNIPPET_SUFFIX}`,
});
```

## Before

```ts
item.createEl('div', {
  cls: 'review-comments-item-context',
  text: `${ReviewCommentsPaneText.SECTION_PREFIX}${entry.heading}`,
});
```

## After

```ts
item.createDiv({
  cls: 'review-comments-item-context',
  text: `${ReviewCommentsPaneText.SECTION_PREFIX}${entry.heading}`,
});
```

## Before

```ts
const actions = item.createEl('div', { cls: 'review-comments-item-actions' });
```

## After

```ts
const actions = item.createDiv({ cls: 'review-comments-item-actions' });
```

Do not unnecessarily change `button`, `h3`, or `p` creation.

---

# 6. Fix DOM helper and popout compatibility warnings

The review flags direct global `document` usage and raw `document.createElement(...)` calls.

General replacement rules:

| Current pattern                                         | Preferred replacement                                                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `document.createElement('span')`                        | `createSpan()`                                                                                                     |
| `document.createElement('strong')`                      | `createEl('strong')`                                                                                               |
| `document.createElement('em')`                          | `createEl('em')`                                                                                                   |
| `document.createElement('del')`                         | `createEl('del')`                                                                                                  |
| `document.createElement('mark')`                        | `createEl('mark')`                                                                                                 |
| `document.createDocumentFragment()`                     | `createFragment()`                                                                                                 |
| `document.documentElement`                              | `activeDocument.documentElement`                                                                                   |
| `document.createTreeWalker(root, NodeFilter.SHOW_TEXT)` | `root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT)` or the Obsidian-compatible `activeDocument` form |

## `src/live-preview.ts`

Replace direct element creation.

### Strong and emphasis

Before:

```ts
const strong = document.createElement('strong');
const emphasis = document.createElement('em');
```

After:

```ts
const strong = createEl('strong');
const emphasis = createEl('em');
```

### Strike

Before:

```ts
const strike = document.createElement('del');
```

After:

```ts
const strike = createEl('del');
```

### Span

Before:

```ts
const element = document.createElement('span');
element.className = 'review-live-hidden-delimiter';
```

After:

```ts
const element = createSpan({ cls: 'review-live-hidden-delimiter' });
```

### Text and classes

Before:

```ts
const arrow = document.createElement('span');
arrow.className = 'review-sub-arrow';
arrow.textContent = ReviewReadingViewText.SUBSTITUTION_ARROW;
```

After:

```ts
const arrow = createSpan({
  cls: 'review-sub-arrow',
  text: ReviewReadingViewText.SUBSTITUTION_ARROW,
});
```

Preserve all behavior, classes, attributes, text, and append order.

## `src/reading-view.ts`

### Tree walker

Before:

```ts
const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
```

After:

```ts
const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
```

This is safer for popout windows because it uses the document that owns the rendered root.

### Fragment

Before:

```ts
const fragment = document.createDocumentFragment();
```

After:

```ts
const fragment = createFragment();
```

### Dynamic heading

Before:

```ts
const heading = document.createElement(`h${Math.min(6, headingMatch[1].length)}`);
```

After:

```ts
const level = Math.min(6, headingMatch[1].length);
const heading = createEl(`h${level}` as keyof HTMLElementTagNameMap);
```

### Span

Before:

```ts
const span = document.createElement('span');
span.className = 'review-token review-token-addition';
span.textContent = token.text;
```

After:

```ts
const span = createSpan({
  cls: 'review-token review-token-addition',
  text: token.text,
});
```

### Mark

Before:

```ts
const mark = document.createElement('mark');
mark.className = 'review-token review-token-highlight';
mark.textContent = token.text;
```

After:

```ts
const mark = createEl('mark', {
  cls: 'review-token review-token-highlight',
  text: token.text,
});
```

### Strong/em/del in inline formatting

Before:

```ts
const strong = document.createElement('strong');
const emphasis = document.createElement('em');
const strike = document.createElement('del');
```

After:

```ts
const strong = createEl('strong');
const emphasis = createEl('em');
const strike = createEl('del');
```

## `src/main.ts`

The review flags:

```text
src/main.ts:833
```

This is likely:

```ts
const root = document.documentElement;
```

Change it to:

```ts
const root = activeDocument.documentElement;
```

If TypeScript complains that `activeDocument` is not known, try importing it from `obsidian` if the installed Obsidian typings expose it. If not, use a local helper that safely falls back:

```ts
const root = (globalThis.activeDocument ?? document).documentElement;
```

However, prefer the Obsidian-recommended `activeDocument` if TypeScript accepts it.

---

# 7. Add GitHub Actions release workflow with artifact attestations

Your existing `.github/workflows/ci.yml` runs CI only. Add a dedicated release workflow.

Create:

```text
.github/workflows/release.yml
```

Content:

```yaml
name: Release

on:
  push:
    tags:
      - '*.*.*'

permissions:
  contents: write
  id-token: write
  attestations: write

jobs:
  release:
    name: Build, attest, and publish release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Ensure tag matches manifest and package versions
        shell: bash
        run: |
          node <<'NODE'
          const fs = require('fs');
          const tag = process.env.GITHUB_REF_NAME;
          const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
          const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

          if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(tag)) {
            throw new Error(`Release tag must be x.y.z without a v prefix. Got: ${tag}`);
          }

          if (manifest.version !== tag) {
            throw new Error(`manifest.json version ${manifest.version} does not match tag ${tag}`);
          }

          if (pkg.version !== tag) {
            throw new Error(`package.json version ${pkg.version} does not match tag ${tag}`);
          }

          console.log(`Version check passed for ${tag}`);
          NODE

      - name: Build
        run: npm run build

      - name: Typecheck
        run: npm run check

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Test
        run: npm test

      - name: Validate Obsidian release assets
        run: npm run release:check -- ${{ github.ref_name }}

      - name: Generate artifact attestations
        uses: actions/attest@v4
        with:
          subject-path: |
            main.js
            manifest.json
            styles.css

      - name: Create GitHub release
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          gh release create "${GITHUB_REF_NAME}" \
            main.js manifest.json styles.css \
            --title "${GITHUB_REF_NAME}" \
            --notes "Release ${GITHUB_REF_NAME}"
```

Important:

- Do not manually upload release assets for this version.
- Let GitHub Actions build, attest, and upload them.
- Do not modify `main.js`, `manifest.json`, or `styles.css` after the attestation step.
- The tag should be exactly `1.1.1`, not `v1.1.1`.

---

# 8. Run local checks

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

If formatting fails:

```powershell
npm run format
npm run format:check
```

If all checks pass:

```powershell
git status
git add .
git commit -m "fix: address Obsidian plugin review feedback"
git push -u origin fix/obsidian-review-feedback-1.1.1
```

Open a PR into your own `main`, review it, and merge it.

---

# 9. Publish the new release

After merging to `main`:

```powershell
git checkout main
git pull
git tag 1.1.1
git push origin 1.1.1
```

This should trigger:

```text
.github/workflows/release.yml
```

The workflow should:

1. install dependencies,
2. verify the tag matches `manifest.json` and `package.json`,
3. build the plugin,
4. run checks,
5. attest `main.js`, `manifest.json`, and `styles.css`,
6. create the GitHub release,
7. upload the release assets.

---

# 10. Verify artifact attestations

Install/update GitHub CLI if needed, then run:

```powershell
gh release download 1.1.1 --repo rohrbachd/obsidian-review-critics --pattern main.js --clobber
gh attestation verify main.js -R rohrbachd/obsidian-review-critics
```

Then:

```powershell
gh release download 1.1.1 --repo rohrbachd/obsidian-review-critics --pattern styles.css --clobber
gh attestation verify styles.css -R rohrbachd/obsidian-review-critics
```

Optional:

```powershell
gh release download 1.1.1 --repo rohrbachd/obsidian-review-critics --pattern manifest.json --clobber
gh attestation verify manifest.json -R rohrbachd/obsidian-review-critics
```

---

# 11. Refresh the Obsidian review

Go back to:

```text
https://community.obsidian.md
```

Check that the plugin submission now sees:

```text
Version: 1.1.1
minAppVersion: 1.7.2
```

If there is a button to re-run review, use it.

If the directory automatically picks up the latest manifest from the default branch, wait for the new review result.

---

# 12. Prompt for a coding agent / Codex

Copy this entire prompt into your coding agent.

```text
You are working in the GitHub repository rohrbachd/obsidian-review-critics.

Goal: fix Obsidian Community Plugin review feedback and prepare a new patch release 1.1.1.

Context:
The Obsidian review for version 1.1.0 failed because src/main.ts uses Workspace.revealLeaf, which requires Obsidian v1.7.2, but manifest.json currently has minAppVersion 1.5.0. There are also review warnings about builtin-modules, missing CodeMirror dependencies, DOM helper usage, popout compatibility, and missing GitHub artifact attestations for release assets.

Tasks:

1. Version bump:
   - Update manifest.json version to 1.1.1.
   - Update manifest.json minAppVersion to 1.7.2.
   - Update package.json version to 1.1.1.
   - Add "1.1.1": "1.7.2" to versions.json.
   - Do not modify old versions.json entries.

2. Replace builtin-modules:
   - In esbuild.config.mjs, replace:
     import builtins from 'builtin-modules';
     with:
     import { builtinModules } from 'node:module';
   - Replace ...builtins with ...builtinModules.
   - Remove builtin-modules from package.json/package-lock by running npm uninstall builtin-modules.

3. Add direct CodeMirror dependencies:
   - Add @codemirror/state and @codemirror/view to dependencies using:
     npm install --save @codemirror/state @codemirror/view
   - Keep them externalized in esbuild.config.mjs.

4. Fix src/comments-view.ts helper warnings:
   - Replace div-specific createEl calls with createDiv:
     root.createEl('div', ...) -> root.createDiv(...)
     item.createEl('div', ...) -> item.createDiv(...)
   - Apply this to the comments list, heading, body, snippet, context, and actions divs.
   - Do not unnecessarily change button/h3/p creation.

5. Fix DOM helper and popout warnings:
   - In src/live-preview.ts, replace document.createElement('strong') with createEl('strong').
   - Replace document.createElement('em') with createEl('em').
   - Replace document.createElement('del') with createEl('del').
   - Replace document.createElement('span') with createSpan(...).
   - Preserve all classes, textContent, attributes, and append behavior.

   - In src/reading-view.ts, replace document.createDocumentFragment() with createFragment().
   - Replace document.createElement('span') with createSpan(...).
   - Replace document.createElement('mark') with createEl('mark').
   - Replace document.createElement('strong') with createEl('strong').
   - Replace document.createElement('em') with createEl('em').
   - Replace document.createElement('del') with createEl('del').
   - Replace the dynamic heading creation with createEl(`h${level}` as keyof HTMLElementTagNameMap).
   - Replace document.createTreeWalker(root, NodeFilter.SHOW_TEXT) with root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT), or with the Obsidian-recommended activeDocument form if lint requires it.
   - Preserve existing rendering behavior.

   - In src/main.ts applyCssVariables(), replace document.documentElement with activeDocument.documentElement, using the Obsidian-compatible typing/import pattern that passes TypeScript.

6. Add an attested GitHub release workflow:
   - Create .github/workflows/release.yml.
   - Trigger on pushed tags matching *.*.*.
   - Use permissions:
       contents: write
       id-token: write
       attestations: write
   - Use Node 22.
   - Run:
       npm ci
       version check that GITHUB_REF_NAME equals manifest.json.version and package.json.version, with no v prefix
       npm run build
       npm run check
       npm run lint
       npm run format:check
       npm test
       npm run release:check -- ${{ github.ref_name }}
   - Use actions/attest@v4 with subject-path:
       main.js
       manifest.json
       styles.css
   - Create the GitHub release using gh release create and upload exactly:
       main.js
       manifest.json
       styles.css
   - Do not mutate these files after attesting them.

7. Validate:
   - Run npm install.
   - Run npm run build.
   - Run npm run check.
   - Run npm run lint.
   - Run npm run format:check.
   - Run npm test.
   - Run npm run release:check -- 1.1.1.
   - Fix any TypeScript, lint, or formatting errors introduced by the changes.

8. Commit:
   - Commit message:
     fix: address Obsidian plugin review feedback

Acceptance criteria:
- manifest.json and package.json both say 1.1.1.
- manifest.json minAppVersion is 1.7.2.
- versions.json contains 1.1.1 mapped to 1.7.2.
- No builtin-modules dependency remains.
- @codemirror/state and @codemirror/view are direct dependencies.
- No direct global document usage remains in the files flagged by the review, except where absolutely unavoidable and justified.
- Local build, typecheck, lint, format check, tests, and release check all pass.
- The release workflow can build, attest, and upload main.js, manifest.json, and styles.css.
```

---

# 13. Notes and rationale

## Why release `1.1.1`?

The current failed review is for `1.1.0`. The clean route is to publish a new patch release with the fixes. Do not overwrite or mutate old release history unless you have a strong reason.

## Why raise `minAppVersion` instead of replacing `revealLeaf`?

The review specifically says `Workspace.revealLeaf` requires Obsidian `1.7.2`. Since your feature uses this API intentionally, declaring `1.7.2` is truthful and low-risk.

Alternative: replace `revealLeaf` with older APIs and keep `minAppVersion: 1.5.0`, but that is riskier and requires behavior testing.

## Why attest in GitHub Actions?

The review says `main.js` and `styles.css` do not have artifact attestations. The most reliable fix is to build and release through GitHub Actions, then generate attestations before uploading release assets.

## Why not manually upload assets?

Manual uploads will not automatically have GitHub Actions provenance attestations. Build and upload the assets from the workflow instead.

---

# 14. Source links

Obsidian plugin submission docs:

```text
https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin
```

Obsidian manifest reference:

```text
https://docs.obsidian.md/Reference/Manifest
```

GitHub artifact attestation docs:

```text
https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds
```

GitHub `actions/attest` README:

```text
https://github.com/actions/attest
```

Module replacement note for `builtin-modules`:

```text
https://github.com/es-tooling/module-replacements/blob/main/docs/modules/builtin-modules.md
```
