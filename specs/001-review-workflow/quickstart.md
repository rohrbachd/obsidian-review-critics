# Quickstart: Obsidian Review Workflow v1

## Prerequisites

- Obsidian Desktop installed
- Plugin project available under an Obsidian vault plugin folder (or symlinked)
- Node.js 22+

## Install and Build

```powershell
npm install
npm run check
npm run build
```

## Enable Plugin in Obsidian

1. Open Obsidian settings.
2. Go to Community plugins.
3. Enable `Review & CriticMarkup`.

## Core Manual Validation Flow

1. Open a markdown note with editable content.
2. Run `Insert Comment` and verify token insertion with configured author.
3. Select text and run `Add Comment to Selection`; verify `{==...==}{>> ... <<}` adjacency.
4. Select text and run each mark command:
   - `Mark Selection as Addition`
   - `Mark Selection as Deletion`
   - `Mark Selection as Substitution`
5. Run `Open Comments Pane` and verify comment list appears for active note.
6. Click a pane item and verify cursor navigates to source location.
7. Toggle reading/live preview settings and confirm behavior changes.
8. Restart Obsidian and verify settings persistence.

## Fixture for Edge Cases

Create a note containing:

- Valid tokens for all supported types
- Malformed/unclosed comment syntax
- Code fences containing token-like text
- Nested token-like patterns
- Multiple comments adjacent to same highlighted span

Verify expected v1 behavior from spec (`FR-016`, `FR-017`, `FR-018`).

## Benchmark Profile

- Windows 11 or macOS 14 desktop class machine
- 8 CPU cores (or equivalent), 16 GB RAM minimum
- Node.js 22.x, no CPU throttling enabled
- Benchmark note size: approximately 1,000 lines with mixed review tokens

## Measurement Procedure

1. Run `npm run test:perf` to generate SC-001 and SC-002 metrics.
2. Run `npm run test:integration` to generate SC-003 and SC-004 metrics.
3. Inspect generated artifacts in `artifacts/metrics/`:
   - `sc001-command-latency.json`
   - `sc002-pane-refresh.json`
   - `sc003-navigation-accuracy.json`
   - `sc004-token-distinguishability.json`
4. Confirm values meet thresholds defined in `spec.md` success criteria.
