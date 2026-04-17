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
});
