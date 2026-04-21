// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { ReviewChangesView } from '../../src/changes-view';
import type { TrackedChangeEntry } from '../../src/review-types';

describe('changes-view', () => {
  it('shows empty state when no entries are provided', async () => {
    const view = new ReviewChangesView(
      {} as never,
      async () => {},
      async () => {},
      async () => {},
      async () => {},
      async () => true,
      async () => {},
      () => false,
      () => false,
      () => false,
      () => false
    );
    await view.onOpen();
    expect(view.contentEl.textContent).toContain('No tracked changes found');
  });

  it('renders entry and action buttons', () => {
    const onNavigate = vi.fn().mockResolvedValue(undefined);
    const onAccept = vi.fn().mockResolvedValue(undefined);
    const onReject = vi.fn().mockResolvedValue(undefined);
    const onAcceptAll = vi.fn().mockResolvedValue(undefined);
    const onQuickAction = vi.fn().mockResolvedValue(true);
    const onToggleTrack = vi.fn().mockResolvedValue(undefined);
    const onToggleAccepted = vi.fn().mockResolvedValue(undefined);
    const view = new ReviewChangesView(
      {} as never,
      onNavigate,
      onAccept,
      onReject,
      onAcceptAll,
      onQuickAction,
      onToggleTrack,
      onToggleAccepted,
      () => true,
      () => false,
      () => false
    );

    const entry: TrackedChangeEntry = {
      id: '1',
      type: 'addition',
      from: 0,
      to: 8,
      line: 1,
      heading: 'Root',
      context: '{++x++}',
      text: 'x',
    };
    view.setEntries([entry]);

    const buttons = view.contentEl.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(8);
  });
});
