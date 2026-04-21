// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { ReviewCommentsView } from '../../src/comments-view';

describe('comments-view', () => {
  it('exposes the expected view metadata', () => {
    const view = new ReviewCommentsView(
      {} as never,
      async () => {},
      async () => {},
      () => false
    );
    expect(view.getViewType()).toBe(ReviewCommentsView.VIEW_TYPE);
    expect(view.getDisplayText()).toBe('Review comments');
  });

  it('renders resolve button when entry is actionable', () => {
    const view = new ReviewCommentsView(
      {} as never,
      async () => {},
      async () => {},
      () => false
    );
    view.setEntries([
      {
        id: '1',
        from: 0,
        to: 10,
        line: 1,
        heading: 'Root',
        commentText: 'Check',
        canResolve: true,
      },
    ]);
    expect(view.contentEl.querySelector('.review-comments-resolve-button')).toBeTruthy();
  });
});
