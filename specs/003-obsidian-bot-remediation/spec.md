# Feature Specification: Obsidian Bot Remediation

**Feature Branch**: `003-obsidian-bot-remediation`  
**Created**: 2026-04-22  
**Status**: Draft  
**Input**: User description: "Fix Obsidian review-bot issues, align UI/style/lifecycle patterns, and add regression tests for future submission checks"  
**Glossary**: N/A

## Constitution Alignment (mandatory)

- Principle I (Clear Scope and Requirements): scope limited to reported review-bot findings and prevention coverage.
- Principle III (Quality and Testing): remediation includes automated tests that fail when these patterns regress.
- Principle V (Automation and Documentation): source-level fixes and docs update for review findings tracking.
- No constitution exceptions requested.

## User Scenarios and Testing (mandatory)

### Story Priorities and Motivation

The plugin submission was flagged by ObsidianReviewBot for lifecycle, async usage, settings UI, and style application issues. This feature ensures plugin behavior remains compliant with Obsidian submission expectations and adds tests to prevent reintroducing the same violations. P1 focuses on eliminating required findings; P2 focuses on regression safety.

### User Stories (Prioritized)

### User Story - Remove Required Bot Findings (Priority: P1)

As a plugin maintainer, I want the codebase to satisfy ObsidianReviewBot required checks so that the plugin can progress through community review without avoidable remediation loops.

**Why this priority**: Required findings block or delay approval and increase review cycle time.

**Independent Test**: Run lint/test plus targeted static assertions and verify all previously flagged patterns are absent from source.

**Acceptance Scenarios**:

1. **Given** the plugin source, **When** lifecycle methods and callbacks are inspected, **Then** there are no async methods/callbacks without awaited work in the flagged locations.
2. **Given** plugin unload behavior, **When** the plugin is unloaded, **Then** custom panes are not forcibly detached from user layout.
3. **Given** settings rendering code, **When** section headings are created, **Then** they use Obsidian `Setting(...).setHeading()` patterns instead of direct heading elements.
4. **Given** reading-view token rendering, **When** tokens are decorated, **Then** presentation uses CSS classes rather than inline style assignments for token colors/decoration/layout.

---

### User Story - Prevent Future Submission Regressions (Priority: P2)

As a plugin maintainer, I want automated tests that specifically guard known review-bot rules so that future changes fail in CI before submission.

**Why this priority**: Prevents repeated reviewer feedback and late-cycle fixes.

**Independent Test**: Run unit tests that statically inspect key source files for prohibited patterns and expected compliant patterns.

**Acceptance Scenarios**:

1. **Given** future code changes, **When** prohibited patterns reappear in guarded files, **Then** tests fail with actionable failure messages.
2. **Given** current compliant code, **When** tests run, **Then** all new compliance checks pass.

### Edge Cases

- If a callback must return a promise type but has no asynchronous work, callback definitions should return an existing promise-producing function directly instead of introducing synthetic `async`.
- If visual token behavior changes, CSS class-based styling must remain equivalent for readability and accepted-text rendering behavior.
- If settings sections are rearranged, heading structure must remain semantically clear while using `Setting(...).setHeading()`.

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: The plugin MUST remove all currently reported required ObsidianReviewBot violations documented in `docs/obsidian_bot_checks_26-04-22.md`.
- **FR-002**: View lifecycle methods in flagged pane classes MUST avoid unnecessary `async` declarations when no awaited operation exists.
- **FR-003**: Command and view callbacks in flagged main-plugin locations MUST avoid `async` wrappers without awaited operations.
- **FR-004**: Plugin unload behavior MUST preserve user pane placement by not detaching custom leaves during unload.
- **FR-005**: Pane activation flows MUST explicitly handle promise-returning workspace operations so unhandled-promise warnings are not emitted.
- **FR-006**: Settings headings in flagged settings-tab sections MUST use Obsidian settings-heading API patterns instead of direct heading element creation.
- **FR-007**: Reading-view token rendering MUST avoid direct inline style assignment for color/background/text-decoration/display where CSS classes can provide equivalent behavior.
- **FR-008**: The test suite MUST include regression checks that fail when any previously flagged required patterns reappear in the guarded files.
- **FR-009**: Documentation file `docs/obsidian_bot_checks_26-04-22.md` MUST capture the bot findings with direct source links and remediation status to serve as source-of-truth for this feature.

### Key Entities (include if feature involves data)

- **Bot Finding**: A single required submission check issue, with source links, rule description, and remediation status.
- **Compliance Guard Rule**: A test assertion that encodes one prohibited/required source pattern tied to prior findings.

## Success Criteria (mandatory)

### Measurable Outcomes

- **SC-001**: 100% of required findings listed in the tracked bot-check document are resolved in source code with no unresolved items.
- **SC-002**: Newly added compliance regression tests pass in CI and fail when each guarded prohibited pattern is intentionally reintroduced.
- **SC-003**: Existing lint and test suites complete without regressions after remediation changes.
- **SC-004**: Manual reviewer follow-up on the same rule categories is reduced to zero in the next submission scan cycle.
