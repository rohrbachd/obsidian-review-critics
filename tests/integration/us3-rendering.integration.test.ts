// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';
import { ReviewReadingViewDecorator } from '../../src/reading-view';

describe('US3 rendering behavior', () => {
  const decorator = new ReviewReadingViewDecorator(new ReviewParser());

  it('renders all token classes in reading view', () => {
    const root = document.createElement('div');
    root.textContent = '{++a++}{--b--}{~~x~>y~~}{==h==}{>> [author=A] c <<}';
    decorator.decorate(root, {} as never, true);

    expect(root.querySelector('.review-token-addition')).toBeTruthy();
    expect(root.querySelector('.review-token-deletion')).toBeTruthy();
    expect(root.querySelector('.review-token-substitution')).toBeTruthy();
    expect(root.querySelector('.review-token-highlight')).toBeTruthy();
    expect(root.querySelector('.review-comment-badge, .review-token-has-tooltip')).toBeTruthy();
  });
});
