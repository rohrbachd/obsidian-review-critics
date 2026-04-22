# Obsidian Review Bot Checks - 2026-04-22

Source: https://github.com/obsidianmd/obsidian-releases/pull/12191#issuecomment-4292739527

## Required Findings

1. Async method `onOpen` has no `await` (`Status: fixed in 003 branch`):
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/changes-view.ts#L61-L61
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/comments-view.ts#L39-L39
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/quick-actions-view.ts#L27-L27
2. Async method `onClose` has no `await` (`Status: fixed in 003 branch`):
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/changes-view.ts#L65-L65
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/comments-view.ts#L43-L43
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/quick-actions-view.ts#L31-L31
3. Async arrow function has no `await` (`Status: fixed in 003 branch`):
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/main.ts#L93-L93
4. Do not detach leaves in `onunload` (`Status: fixed in 003 branch`):
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/main.ts#L154-L157
5. Promises must be awaited/handled (`Status: fixed in 003 branch`):
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/main.ts#L390-L390
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/main.ts#L408-L408
6. Settings headings should use `new Setting(containerEl).setName(...).setHeading()` (`Status: fixed in 003 branch`):
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/main.ts#L1051-L1051
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/main.ts#L1143-L1143
   - https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/main.ts#L1219-L1219
7. Avoid direct inline styles in reading view renderer (`Status: fixed in 003 branch`):
   - backgroundColor: https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/reading-view.ts#L114-L114
   - color: https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/reading-view.ts#L115-L115
   - display: https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/reading-view.ts#L116-L116
   - textDecoration: https://github.com/rohrbachd/obsidian-review-critics/blob/ec3c91d2c72418e5840eb362979d5a478b8d93af/src/reading-view.ts#L137-L137

## Optional Findings

None reported.

## Remediation Plan

- Create feature branch/spec `003-obsidian-bot-remediation`.
- Apply source fixes in `src/` for all required findings.
- Add regression tests to prevent reintroduction.

## Compliance Gate Baseline

- Official lint plugin rules enforced in `eslint.config.mjs`:
  - `obsidianmd/detach-leaves`
  - `obsidianmd/no-static-styles-assignment`
  - `obsidianmd/settings-tab/no-manual-html-headings`
- Local guard tests enforced in `tests/unit/obsidian-bot-compliance.unit.test.ts`:
  - Full-scope scan over `src/**/*.ts`
  - Prohibited-pattern checks for lifecycle async usage, leaf detachment, inline style assignment, and manual settings headings
  - Allowlist metadata validation (`path`, `rationale`, `reviewBy`)
  - Negative-path regression proof test

## Waiver Register

No waivers are currently active.

If a waiver is added, record:

- finding reference
- rationale
- approver
- review date

## SC-004 Follow-up Log

- Window start: 2026-04-22
- Window end: 2026-05-22
- Evidence source: `obsidianmd/obsidian-releases` PR comments and check logs
- Current status: pending window completion
