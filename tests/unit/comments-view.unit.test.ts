// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { ReviewCommentsView } from '../../src/comments-view';

describe('comments-view', () => {
  it('exposes the expected view metadata', () => {
    const view = new ReviewCommentsView({} as never, async () => {});
    expect(view.getViewType()).toBe(ReviewCommentsView.VIEW_TYPE);
    expect(view.getDisplayText()).toBe('Review comments');
  });
});
