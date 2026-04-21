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

  it('renders substitution with old/new split and strike-through only on old side', () => {
    const root = document.createElement('div');
    root.textContent = '{~~old~>new~~}';
    decorator.decorate(root, {} as never, true);

    const oldPart = root.querySelector('.review-sub-old') as HTMLElement | null;
    const newPart = root.querySelector('.review-sub-new') as HTMLElement | null;
    const wrapper = root.querySelector('.review-token-substitution') as HTMLElement | null;

    expect(wrapper).toBeTruthy();
    expect(oldPart?.textContent).toBe('old');
    expect(newPart?.textContent).toBe('new');
    expect(oldPart?.style.textDecoration).toContain('line-through');
    expect(newPart?.style.textDecoration).toBe('');
    expect(wrapper?.style.textDecoration).toBe('');
  });

  it('renders formatted substitution new side without literal markdown markers', () => {
    const root = document.createElement('div');
    root.textContent = '{~~barriers~>**barriers**~~} {~~entry~>*entry*~~}';
    decorator.decorate(root, {} as never, true);

    const strong = root.querySelector('.review-sub-new strong');
    const emphasis = root.querySelector('.review-sub-new em');

    expect(strong?.textContent).toBe('barriers');
    expect(emphasis?.textContent).toBe('entry');
    expect(root.textContent).not.toContain('**barriers**');
    expect(root.textContent).not.toContain('*entry*');
  });

  it('keeps comments visible in accepted-text reading view', () => {
    const root = document.createElement('div');
    root.textContent = '{++a++}{--b--}{~~x~>y~~}{>> [author=A] c <<}';
    decorator.decorate(root, {} as never, true, true);

    expect(root.textContent).toContain('a');
    expect(root.textContent).not.toContain('b');
    expect(root.textContent).toContain('y');
    expect(root.querySelector('.review-comment-badge')).toBeTruthy();
  });
});
