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

- Lint includes official Obsidian lint rules.
- Unit tests include local compliance guards and fail on prohibited patterns.

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
