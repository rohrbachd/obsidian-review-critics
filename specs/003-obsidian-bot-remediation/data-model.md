# Data Model: Obsidian Bot Remediation

## Delta vs Canonical (`docs/data-model.md`)

New conceptual entities introduced for compliance planning and validation:

1. `ComplianceGuardRule`
2. `BotFindingStatus`
3. `ComplianceGateResult`

No changes to runtime review token parsing entities (`ReviewToken`, `CommentPaneEntry`, `TrackedChangeEntry`, settings/theme entities).

## Entity: ComplianceGuardRule

- Purpose: Captures one enforceable rule that must hold for source compliance.
- Fields:
  - `id`: unique rule identifier
  - `source`: `official-lint` | `local-regression-test`
  - `scopePattern`: source-file scope expression (for this feature: `src/**/*.ts`)
  - `assertion`: plain-language rule assertion
  - `allowlist`: optional list of file/path exceptions with justification
  - `severity`: `blocking` | `warning`
  - `enabled`: boolean

## Entity: BotFindingStatus

- Purpose: Tracks remediation state of each externally reported required finding.
- Fields:
  - `findingId`: stable internal ID for a finding in tracked docs
  - `externalReference`: link to review-bot comment and line reference(s)
  - `category`: async usage | lifecycle | UI heading | inline style | promise handling | other
  - `status`: `open` | `fixed` | `waived`
  - `waiverRationale`: optional required text when status is `waived`
  - `updatedAt`: timestamp/date marker

## Entity: ComplianceGateResult

- Purpose: Represents a single gate run outcome used for CI/release readiness decisions.
- Fields:
  - `runId`: unique run identifier
  - `ruleResults`: list of per-rule pass/fail outcomes
  - `blockingFailures`: count of blocking failures
  - `warnings`: count of warning-level findings
  - `finalStatus`: `pass` | `fail`
  - `releaseEligible`: boolean derived from `blockingFailures == 0` or approved waiver

## Validation Rules

- Any `ComplianceGuardRule` with `severity=blocking` must fail the gate when violated.
- Any `BotFindingStatus` set to `waived` must include non-empty `waiverRationale`.
- `ComplianceGateResult.releaseEligible` must be `false` when `blockingFailures > 0`.

## Lifecycle Notes

- `BotFindingStatus`: `open -> fixed` or `open -> waived`.
- `ComplianceGateResult`: emitted per CI run; immutable once recorded in run logs.
