# Quickstart: Obsidian Bot Remediation

## 1. Ensure branch and dependencies

```powershell
git checkout 003-obsidian-bot-remediation
npm install
```

## 2. Run blocking compliance gate locally

```powershell
npm run lint
npm run test:unit
```

Expected:

- Lint includes official Obsidian lint plugin rules:
  - `obsidianmd/detach-leaves`
  - `obsidianmd/no-static-styles-assignment`
  - `obsidianmd/settings-tab/no-manual-html-headings`
- Unit tests include local compliance guards over all `src/**/*.ts` and fail on prohibited patterns.
- Allowlist exceptions, if present, must include `path`, `rationale`, and `reviewBy` date metadata.

## 3. Run full validation suite

```powershell
npm test
npm run build
```

## 4. Verify remediation documentation

- Confirm findings and status tracking in:
  - `docs/obsidian_bot_checks_26-04-22.md`
- Confirm feature artifacts:
  - `specs/003-obsidian-bot-remediation/spec.md`
  - `specs/003-obsidian-bot-remediation/plan.md`
  - `specs/003-obsidian-bot-remediation/research.md`
  - `specs/003-obsidian-bot-remediation/data-model.md`

## 5. Release-readiness rule

- Do not publish a release when compliance gate has blocking failures unless a documented waiver exists and is approved.

## 6. Validation record (2026-04-22)

Executed successfully on branch `003-obsidian-bot-remediation`:

- `npm run lint`
- `npm run test:unit`
- `npm test`
- `npm run build`

## 7. SC-004 verification procedure (30-day follow-up)

- Time window: from submission update date through the next 30 calendar days.
- Evidence sources:
  - PR comments and check logs in `obsidianmd/obsidian-releases`
  - Submission PR status updates for the plugin entry
- Recording location: `docs/obsidian_bot_checks_26-04-22.md` under "SC-004 Follow-up Log".
- Pass criterion: zero follow-up issues in remediated categories during the time window.
- Fail criterion: one or more new findings in remediated categories; requires remediation task reopening.
