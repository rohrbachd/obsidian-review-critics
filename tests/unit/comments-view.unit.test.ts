// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
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

  it('uses div helpers for comments pane structural containers', () => {
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
        highlightedText: 'Snippet',
        canResolve: true,
      },
    ]);

    expect(view.contentEl.querySelector('.review-comments-list')?.tagName).toBe('DIV');
    expect(view.contentEl.querySelector('.review-comments-item-heading')?.tagName).toBe('DIV');
    expect(view.contentEl.querySelector('.review-comments-item-body')?.tagName).toBe('DIV');
    expect(view.contentEl.querySelector('.review-comments-item-snippet')?.tagName).toBe('DIV');
    expect(view.contentEl.querySelector('.review-comments-item-context')?.tagName).toBe('DIV');
    expect(view.contentEl.querySelector('.review-comments-item-actions')?.tagName).toBe('DIV');
  });

  it('retains single toolbar/control selector declarations used by pane behavior styling', () => {
    const styles = readFileSync(path.resolve(process.cwd(), 'styles.css'), 'utf8');
    expect(styles.match(/^\.review-changes-toolbar\s*\{/gm)?.length ?? 0).toBe(1);
    expect(styles.match(/^\.review-track-toggle\s*\{/gm)?.length ?? 0).toBe(1);
    expect(styles.match(/^\.review-pane-separator\s*\{/gm)?.length ?? 0).toBe(1);
    expect(
      styles.match(/^\.review-quick-actions-row,\s*\r?\n\.review-changes-controls-row\s*\{/gm)
        ?.length ?? 0
    ).toBe(1);
  });
});
