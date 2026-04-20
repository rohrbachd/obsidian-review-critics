// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { ReviewCommentsView } from '../../src/comments-view';

describe('comments-view resolve controls', () => {
  it('shows resolve button for actionable entries', async () => {
    const onResolve = vi.fn().mockResolvedValue(undefined);
    const view = new ReviewCommentsView({} as never, async () => {}, onResolve, () => false);

    view.setEntries([
      {
        id: '1',
        from: 0,
        to: 10,
        line: 1,
        heading: 'Root',
        commentText: 'Fix',
        canResolve: true,
      },
    ]);

    const resolveButton = view.contentEl.querySelector('.review-comments-resolve-button');
    expect(resolveButton).toBeTruthy();
  });

  it('prevents duplicate resolve clicks while pending', async () => {
    let release!: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    const onResolve = vi.fn().mockImplementation(() => pending);
    const view = new ReviewCommentsView({} as never, async () => {}, onResolve, () => false);

    view.setEntries([
      {
        id: '1',
        from: 0,
        to: 10,
        line: 1,
        heading: 'Root',
        commentText: 'Fix',
        canResolve: true,
      },
    ]);

    const resolveButton = view.contentEl.querySelector(
      '.review-comments-resolve-button'
    ) as HTMLButtonElement;
    resolveButton.click();
    resolveButton.click();
    expect(onResolve).toHaveBeenCalledTimes(1);

    release();
    await pending;
  });
});
