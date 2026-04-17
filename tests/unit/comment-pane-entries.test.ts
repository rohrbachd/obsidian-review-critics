import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';

describe('comment pane entry generation', () => {
  const parser = new ReviewParser();

  it('maps anchored comments into pane entries with highlightedText', () => {
    const input = '# H\n{==abc==}{>> [author=A] n <<}';
    const entries = parser.buildCommentEntries(input);
    expect(entries).toHaveLength(1);
    expect(entries[0].highlightedText).toBe('abc');
    expect(entries[0].author).toBe('A');
    expect(entries[0].heading).toBe('H');
  });
});
