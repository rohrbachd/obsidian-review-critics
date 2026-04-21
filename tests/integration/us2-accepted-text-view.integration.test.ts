// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';
import { ReviewReadingViewDecorator } from '../../src/reading-view';

describe('us2 accepted text view integration', () => {
  const decorator = new ReviewReadingViewDecorator(new ReviewParser());

  it('hides deletions and substitutions old text while keeping comments visible', () => {
    const root = document.createElement('div');
    root.textContent = '{++add++} {--remove--} {~~old~>new~~} {>> [author=A] note <<}';

    decorator.decorate(root, {} as never, true, true);

    expect(root.textContent).toContain('add');
    expect(root.textContent).not.toContain('remove');
    expect(root.textContent).toContain('new');
    expect(root.querySelector('.review-comment-badge')).toBeTruthy();
  });

  it('keeps resolved structural markdown text visible in accepted-text mode', () => {
    const root = document.createElement('div');
    root.textContent = '{++## Technologies++}\n{++- Kubernetes++}\n{~~draft~>```ts```~~}';

    decorator.decorate(root, {} as never, true, true);

    expect(root.textContent).toContain('## Technologies');
    expect(root.textContent).toContain('- Kubernetes');
    expect(root.textContent).toContain('```ts```');
  });
});
