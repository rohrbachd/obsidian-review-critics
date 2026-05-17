# Feature Specification: Release Provenance and CSS Hygiene

**Feature Branch**: `005-release-attestation-css`  
**Created**: 2026-05-17  
**Status**: Draft  
**Input**: User description: "Address release recommendations by ensuring GitHub artifact attestations cover main.js and styles.css assets and remediate CSS lint warnings in styles.css for !important usage and duplicate selectors."  
**Glossary**: N/A

## Constitution Alignment (mandatory)

- Principle I (Clear Scope and Requirements): This spec defines explicit scope boundaries, acceptance scenarios, and measurable outcomes for release provenance and stylesheet quality gates.
- Principle III (Quality and Testing): The feature requires automated checks that fail when attestation coverage or scoped CSS lint quality expectations are not met.
- Principle V (Automation and Documentation): The feature requires release workflow and documentation updates so automated publication and verification remain reproducible.
- No constitution exceptions are requested.

## User Scenarios and Testing (mandatory)

### Story Priorities and Motivation

This feature addresses release trust and publish readiness by closing two audit/recommendation gaps: missing artifact attestations for published assets and unresolved stylesheet lint warnings.  
P1 ensures release consumers can verify provenance for published artifacts. P2 ensures maintainers can pass stylesheet quality gates without warning debt in the targeted rules.

### User Stories (Prioritized)

### User Story - Verify Release Provenance for Published Assets (Priority: P1)

As a release consumer, I need published plugin assets to include verifiable provenance evidence so I can trust that release artifacts were produced from the repository workflow.

**Why this priority**: Missing artifact attestations directly affect release trust and submission quality.

**Independent Test**: Can be fully tested by producing a tagged release and confirming that each required artifact has associated attestation evidence and verification instructions.

**Acceptance Scenarios**:

1. **Given** a tagged release is published, **When** a maintainer inspects release assets, **Then** provenance attestations exist for both `main.js` and `styles.css`.
2. **Given** a published release, **When** a maintainer follows documented verification steps, **Then** provenance verification succeeds for the attested assets.

---

### User Story - Clear Scoped Stylesheet Lint Warnings (Priority: P2)

As a maintainer, I need the stylesheet to satisfy scoped lint expectations so quality checks pass consistently before release publication.

**Why this priority**: Lint warning debt blocks quality gates and slows release throughput.

**Independent Test**: Can be fully tested by running the stylesheet lint checks and confirming no warnings remain for the targeted warning set.

**Acceptance Scenarios**:

1. **Given** the current stylesheet, **When** lint checks run, **Then** the targeted `!important` warning set is reduced to zero violations.
2. **Given** the current stylesheet, **When** lint checks run, **Then** duplicate-selector warnings for the identified selectors are reduced to zero violations.

---

### Edge Cases

- A release job succeeds partially but omits one required asset from attestation evidence; the process must be treated as incomplete.
- A stylesheet fix removes warnings but changes rendered behavior in existing panes; regression checks must prevent unintended visual or interaction changes.
- A future style change reintroduces one of the previously flagged duplicate selectors; quality checks must fail clearly enough to block unnoticed regressions.

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: The release process MUST produce published release artifacts where both `main.js` and `styles.css` are covered by artifact attestations.
- **FR-002**: The project MUST provide maintainer-facing verification guidance for attestation checks on required release assets.
- **FR-003**: Quality gates MUST fail when required attestation coverage for `main.js` or `styles.css` is missing from a release.
- **FR-004**: The stylesheet MUST eliminate the targeted `!important` usages cited in the review findings.
- **FR-005**: The stylesheet MUST eliminate duplicate-selector warnings for this selector set: `.review-changes-toolbar`, `.review-quick-actions-row,.review-changes-controls-row`, `.review-track-toggle`, and `.review-pane-separator`.
- **FR-006**: The stylesheet warning remediation MUST preserve existing reviewer-facing interaction behavior for comments, quick actions, and change controls.
- **FR-007**: Project documentation and remediation tracking artifacts MUST record that the attestation and scoped CSS warning findings are resolved.

### Non-Functional Requirements

- **NFR-001**: Release-readiness validation for this feature MUST be reproducible in local and CI environments using the documented command sequence.
- **NFR-002**: Provenance verification for required assets (`main.js`, `styles.css`) MUST complete in 10 minutes or less when following documented steps.
- **NFR-003**: Scoped stylesheet warning remediation MUST not increase reviewer-facing integration test failures relative to the baseline run defined as the latest successful `main` branch CI run for the same targeted suites.
- **NFR-004**: Evidence for recommendation closure MUST be recorded with traceable references in feature documentation before implementation sign-off.

### Key Entities (include if feature involves data)

- **Release Asset Provenance Evidence**: Verification evidence associated with published artifacts, including whether each required release asset has attestation coverage and can be validated by maintainers.
- **Scoped Stylesheet Warning Set**: The bounded set of lint findings identified for remediation in this feature (`!important` and duplicate-selector warnings for specifically cited selectors).
- **Release Readiness Record**: The project documentation state that tracks whether release trust and quality findings are unresolved, in progress, or resolved.

## Assumptions and Dependencies

- Release publication continues to use the existing tag-based workflow and release asset list.
- Existing lint configuration remains authoritative for warning detection in this scope.
- This feature does not introduce new durable storage requirements or modify the system of record for plugin runtime data.

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: 100% of required published assets (`main.js`, `styles.css`) in the next release have verifiable artifact attestation coverage.
- **SC-002**: Maintainers can complete attestation verification for required assets using documented steps in under 10 minutes.
- **SC-003**: The targeted stylesheet warning set reports zero violations in CI for the configured lint checks.
- **SC-004**: During feature validation, targeted reviewer-facing regression suites complete with zero new failures versus the latest successful `main` branch CI baseline for `tests/integration/us3-rendering.integration.test.ts`, `tests/unit/reading-view.unit.test.ts`, and `tests/unit/comments-view.unit.test.ts`.
