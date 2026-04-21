# Review Fix Record (2026-04-20)

## Backup

- Backed up previous review artifacts to:
- `specs/002-track-changes-workflow/review-backups/20260420-103605/ai-review.md`
- `specs/002-track-changes-workflow/review-backups/20260420-103605/gl-code-quality-report.json`
- `specs/002-track-changes-workflow/review-backups/20260420-103605/review-meta.json`

## Previously Reported Findings and Fixes

1. Command lock deadlock risk in `runCommandExclusive`

- Fixed in `src/main.ts` by placing pre-command refresh inside `try/finally` and preserving lock release even on errors.
- Added regression test in `tests/unit/main.unit.test.ts`.

2. Incorrect reject resolution in `rejectTrackedChangeByMarkup`

- Fixed in `src/change-resolution.ts` by parsing match groups and replacing by explicit offsets.
- Added regression tests in `tests/unit/change-resolution.unit.test.ts`.

3. Missing critical-path tests

- Added focused tests for command lock exception path and reject-by-markup behavior.

4. Theme preset ID collision risk

- Fixed in `src/theme-presets.ts` by deriving unique IDs (`base`, `base-1`, ...) when collisions occur.
- Added regression test in `tests/unit/theme-presets.unit.test.ts`.

## New Review Outputs

- `.review/ai-review.md`
- `.review/gl-code-quality-report.json`
- `.review/review-meta.json`
