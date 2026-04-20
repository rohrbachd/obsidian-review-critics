// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';
import { ReviewReadingViewDecorator } from '../../src/reading-view';

describe('reading-view', () => {
  const decorator = new ReviewReadingViewDecorator(new ReviewParser());

  it('decorates token text in reading DOM', () => {
    const root = document.createElement('div');
    root.textContent = 'Text {++new++} end';
    decorator.decorate(root, {} as never, true);
    expect(root.querySelector('.review-token-addition')?.textContent).toBe('new');
  });

  it('does nothing when disabled', () => {
    const root = document.createElement('div');
    root.textContent = 'Text {++new++} end';
    decorator.decorate(root, {} as never, false);
    expect(root.textContent).toContain('{++new++}');
  });

  it('renders comment badge without native title tooltip', () => {
    const root = document.createElement('div');
    root.textContent = '{>> [author=Alex] Needs citation <<}';
    decorator.decorate(root, {} as never, true);

    const badge = root.querySelector('.review-comment-badge');
    expect(badge).toBeTruthy();
    expect(badge?.getAttribute('data-review-tooltip')).toContain('Alex');
    expect(badge?.hasAttribute('title')).toBe(false);
  });
});
