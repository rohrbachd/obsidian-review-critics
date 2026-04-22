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

  it('projects accepted structural markdown text from tracked tokens', () => {
    const root = document.createElement('div');
    root.textContent = '{++# New Heading++}\n{++- item++}\n{~~old~>```ts```~~}';
    decorator.decorate(root, {} as never, true, true);

    expect(root.textContent).toContain('# New Heading');
    expect(root.textContent).toContain('- item');
    expect(root.textContent).toContain('```ts```');
    expect(root.textContent).not.toContain('{++');
    expect(root.textContent).not.toContain('{~~');
  });

  it('renders heading-like additions with heading semantics in markup-aware mode', () => {
    const root = document.createElement('div');
    root.textContent = '{++# Title++}';
    decorator.decorate(root, {} as never, true, false);

    const heading = root.querySelector('h1.review-token-struct-heading');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toBe('Title');
  });

  it('renders substitution new side markdown wrappers as formatted text without marker literals', () => {
    const root = document.createElement('div');
    root.textContent = '{~~old~>**bold**~~} and {~~old~>*italic*~~}';
    decorator.decorate(root, {} as never, true, false);

    const strong = root.querySelector('.review-sub-new strong');
    const emphasis = root.querySelector('.review-sub-new em');

    expect(strong?.textContent).toBe('bold');
    expect(emphasis?.textContent).toBe('italic');
    expect(root.textContent).not.toContain('**bold**');
    expect(root.textContent).not.toContain('*italic*');
  });

  it('does not force plain substitution new side to bold', () => {
    const root = document.createElement('div');
    root.textContent = '{~~old~>plain~~}';
    decorator.decorate(root, {} as never, true, false);

    const plainNew = root.querySelector('.review-sub-new') as HTMLElement | null;
    expect(plainNew?.style.fontWeight).toBe('');
  });

  it('uses classes instead of inline styles for decorated tokens', () => {
    const root = document.createElement('div');
    root.textContent = '{++add++}{--del--}{~~old~>new~~}{==hl==}';
    decorator.decorate(root, {} as never, true, false);

    const addition = root.querySelector('.review-token-addition') as HTMLElement | null;
    const deletion = root.querySelector('.review-token-deletion') as HTMLElement | null;
    const highlight = root.querySelector('.review-token-highlight') as HTMLElement | null;
    const subOld = root.querySelector('.review-sub-old') as HTMLElement | null;

    expect(addition?.getAttribute('style')).toBeNull();
    expect(deletion?.getAttribute('style')).toBeNull();
    expect(highlight?.getAttribute('style')).toBeNull();
    expect(subOld?.getAttribute('style')).toBeNull();
  });
});
