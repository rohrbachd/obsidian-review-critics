# Research: Obsidian Bot Remediation

## Decision 1: Compliance gate composition

- Decision: Use both official Obsidian lint rules and repository-local compliance guard tests.
- Rationale: Official rules track reviewer expectations; local guards provide immediate protection for project-specific regressions and known failure patterns.
- Alternatives considered:
  - Official rules only: lower maintenance but misses project-specific drift.
  - Local guards only: misses upstream policy shifts captured by official rules.

## Decision 2: Guard coverage scope

- Decision: Apply compliance guard checks across all `src/**/*.ts`, with explicit allowlisted exceptions.
- Rationale: Bot findings may reappear in new modules; global scope reduces blind spots.
- Alternatives considered:
  - Guard only previously flagged files: easier initially, higher recurrence risk.
  - Guard only changed files: misses latent violations outside diff scope.

## Decision 3: Failure policy

- Decision: Treat compliance-gate failures as blocking for CI and release readiness.
- Rationale: Prevents avoidable submission rejection loops and aligns with constitution quality gate expectations.
- Alternatives considered:
  - Warning-only policy: faster merges, but higher risk of release rejection.
  - Blocking only on `main`: may still allow problematic PRs to accumulate.

## Decision 4: Styling remediation approach

- Decision: Replace direct inline style assignments in reading renderer with CSS classes already supported by stylesheet variables.
- Rationale: Aligns with Obsidian maintainability guidance and keeps theming centralized.
- Alternatives considered:
  - Keep inline styles and suppress lint: conflicts with reviewer expectations.
  - Runtime `setCssProps` for each token node: unnecessary churn compared to stable classes.

## Decision 5: Settings heading normalization

- Decision: Use `new Setting(container).setName(...).setHeading()` for settings section headings.
- Rationale: Matches Obsidian UI consistency guidance and resolves reviewer rule directly.
- Alternatives considered:
  - Continue with raw `h2/h3` elements: keeps current markup but fails reviewer guidance.
