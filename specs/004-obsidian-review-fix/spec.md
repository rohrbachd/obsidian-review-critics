# Feature Specification: Obsidian Review Feedback Remediation

**Feature Branch**: `004-obsidian-review-fix`  
**Created**: 2026-05-17  
**Status**: Draft  
**Input**: User description: "Run speckit.specify against docs/review-critic-obsidian-review-fix-plan.md and create a new branch starting with 004"  
**Glossary**: N/A

## Constitution Alignment (mandatory)

- Principle I (Clear Scope and Requirements): scope is bounded to resolving the documented plugin-review blockers and warnings for the next patch release.
- Principle III (Quality and Testing): release readiness requires passing validation checks before publishing artifacts.
- Principle IV (Security and Privacy): release provenance must be verifiable through artifact attestations before distribution.
- Principle V (Automation and Documentation): release and validation steps are automated, and remediation status is documented for reviewer traceability.
- No constitution exceptions requested.

## User Scenarios and Testing (mandatory)

### Story Priorities and Motivation

The latest community review failed due to a compatibility declaration mismatch and additional quality warnings. This feature ensures the next patch release is review-compliant, provenance-backed, and ready for resubmission with minimal risk. P1 removes the blocking error, P2 resolves warning-level findings while preserving behavior, and P3 ensures release evidence is automated and auditable.

### User Stories (Prioritized)

### User Story - Publish Accurate Compatibility Metadata (Priority: P1)

As a plugin maintainer, I want release metadata to accurately reflect the minimum supported app version so that review blockers are removed and users install only compatible versions.

**Why this priority**: The mismatch is a hard review failure and blocks approval.

**Independent Test**: Verify the patch release metadata and version-to-compatibility mapping are internally consistent and include the new patch entry without rewriting historical entries.

**Acceptance Scenarios**:

1. **Given** a patch release candidate, **When** maintainers inspect version metadata, **Then** the release version and minimum supported app version match the actual runtime requirements.
2. **Given** existing published version mappings, **When** the new patch mapping is added, **Then** prior mappings remain unchanged and the new mapping is appended.

---

### User Story - Resolve Review Warnings Without Regressions (Priority: P2)

As a plugin maintainer, I want all documented review warnings addressed in source behavior so that the plugin passes review checks without changing intended user workflows.

**Why this priority**: Warning-level findings commonly become repeat review loops if not remediated.

**Independent Test**: Run static and behavioral checks to confirm flagged patterns are removed and core editing/review workflows still behave as expected in standard and secondary windows.

**Acceptance Scenarios**:

1. **Given** the remediation branch, **When** review-targeted checks run, **Then** previously reported warning categories are no longer present.
2. **Given** existing reading and editing workflows, **When** rendering and interaction paths execute after remediation, **Then** user-visible behavior is equivalent to baseline expectations.
3. **Given** plugin views opened in alternate windows, **When** the same interactions occur, **Then** the behavior remains consistent with the main window.

---

### User Story - Release with Attested Assets and Resubmission Evidence (Priority: P3)

As a plugin maintainer, I want release artifacts to be built, attested, and published by automation so that review provenance requirements are satisfied and resubmission evidence is straightforward.

**Why this priority**: Missing provenance was explicitly cited and can delay acceptance even if code issues are fixed.

**Independent Test**: Trigger a tagged release flow, verify required artifacts are generated with attestations, and confirm release evidence is available for reviewer follow-up.

**Acceptance Scenarios**:

1. **Given** a valid patch-release tag, **When** the release pipeline runs, **Then** build/validation gates must pass before publication.
2. **Given** successful release execution, **When** reviewers inspect release assets, **Then** required assets are attached with verifiable provenance attestations.

### Edge Cases

- If release metadata and tag values diverge, publication must stop before assets are published.
- If historical compatibility mappings are modified unintentionally, validation must fail and require correction.
- If a compatibility helper pattern works in the main window but fails in secondary windows, the change is not acceptable.
- If attestation generation fails for any required artifact, release publication must be blocked.
- If non-blocking warnings remain unresolved, resubmission readiness must be marked incomplete.

## Requirements (mandatory)

### Canonical Review Findings Baseline (2026-05-07)

The authoritative findings set for this feature is the failed Obsidian review dated **2026-05-07**, sourced from `docs/review-critic-obsidian-review-fix-plan.md`.

- **RF-001 (blocking)**: `Workspace.revealLeaf` requires Obsidian `1.7.2` while published `minAppVersion` is `1.5.0`.
- **RF-002 (warning)**: missing artifact attestations for `main.js` and `styles.css`.
- **RF-003 (warning)**: deprecated `builtin-modules` usage in build configuration.
- **RF-004 (warning)**: direct CodeMirror dependency declarations are missing.
- **RF-005 (warning)**: `createEl('div', ...)` usage where `createDiv(...)` is expected in flagged comment-pane blocks.
- **RF-006 (warning)**: direct global `document` usage and raw DOM creation patterns in flagged rendering paths.
- **RF-007 (warning)**: popout compatibility risk from document ownership assumptions in flagged rendering paths.

### Functional Requirements

- **FR-001**: The project MUST publish a new patch release designated `1.1.1` for remediation, rather than mutating the previously failed `1.1.0` release.
- **FR-002**: The `1.1.1` release metadata MUST declare a minimum supported Obsidian app version of `1.7.2`.
- **FR-003**: Version compatibility records MUST append a new entry for `1.1.1 -> 1.7.2` while preserving all prior published mappings unchanged.
- **FR-004**: All blocking findings in the canonical 2026-05-07 baseline (`RF-001`) MUST be resolved before resubmission.
- **FR-005**: Warning-level findings in the canonical 2026-05-07 baseline (`RF-002` through `RF-007`) MUST be addressed with behavior-preserving source changes.
  - For this feature, **behavior-preserving** means existing unit, integration, and performance suites remain passing, and there is no new regression in reading-view rendering, live-preview rendering, comments-pane interaction, or secondary-window behavior.
- **FR-006**: UI element creation and document-access patterns in flagged areas MUST use explicit host-compatible rules that are verifiable in code review and tests.
  - Raw global document element creation patterns (`document.createElement`, `document.createDocumentFragment`) MUST be removed in flagged files when an Obsidian helper or owner-document-safe equivalent is available.
  - Document traversal in flagged files MUST resolve from the owner document context of the rendered root (or an equivalent active-document-safe path) to preserve secondary-window behavior.
- **FR-007**: Dependency declarations MUST explicitly include all review-flagged runtime packages used by the plugin, and deprecated/rejected replacements MUST be removed.
- **FR-008**: The release process MUST run build, lint/format, type, test, and release-asset validation checks before publishing release artifacts.
- **FR-009**: Release automation MUST generate provenance attestations for each required distribution artifact (`main.js`, `manifest.json`, `styles.css`) before publishing the release.
- **FR-010**: Release artifacts published for `1.1.1` MUST exactly include `main.js`, `manifest.json`, and `styles.css` produced by the validated release run.
- **FR-011**: Remediation documentation MUST remain current and map each reported review finding to its resolution status for reviewer traceability.
- **FR-012**: Resubmission readiness MUST include evidence that metadata, code remediation, and attested release outputs all satisfy the review requirements.

### Non-Functional Requirements

- **NFR-001 (Quality Gates)**: Local and CI validation MUST both run build, typecheck, lint, format check, tests, and release metadata validation as blocking checks for release readiness.
- **NFR-002 (Performance Stability)**: Reading-view and live-preview critical-path performance MUST show no measurable regression in tracked perf suites compared with pre-remediation baseline runs.
  - Baseline source-of-truth: the pre-remediation run captured in `specs/004-obsidian-review-fix/quickstart.md`.
  - Accepted tolerance: p95 latency increase MUST be <= 10% and absolute p95 increase MUST be <= 15 ms for each tracked perf scenario.
- **NFR-003 (Reliability)**: Release publication MUST fail-fast when version/tag validation fails or when required artifact attestations are missing.
- **NFR-004 (Documentation Traceability)**: Reviewer-facing remediation evidence MUST remain synchronized with implemented fixes and include mappings to all canonical findings (`RF-001` through `RF-007`).

### Key Entities (include if feature involves data)

- **ReviewFindingRecord**: A tracked reviewer finding with category (blocking/warning), source reference, remediation status, and evidence link.
- **ReleaseCompatibilityRecord**: Version metadata that links a plugin release version to the minimum supported app version.
- **ReleaseValidationResult**: Outcome of required pre-release checks, including pass/fail status and blocking conditions.
- **ReleaseArtifactProvenance**: Evidence object proving required release artifacts were produced and attested by the trusted release workflow.

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: Zero unresolved blocking findings remain from the 2026-05-07 failed review before submitting the next review attempt.
- **SC-002**: The `1.1.1` release metadata is internally consistent in 100% of checked locations, and legacy compatibility mappings remain unchanged.
- **SC-003**: All required pre-release checks pass in the same run that produces the release artifacts.
- **SC-004**: 100% of required distribution artifacts (`main.js`, `manifest.json`, `styles.css`) are published with verifiable attestations.
- **SC-005**: Review resubmission is completed using release `1.1.1` with no repeat of the original compatibility-blocker category.
- **SC-006**: Reading-view and live-preview performance suites complete with p95 latency regression <= 10% and <= 15 ms absolute delta versus the pre-remediation baseline recorded in `specs/004-obsidian-review-fix/quickstart.md`.
