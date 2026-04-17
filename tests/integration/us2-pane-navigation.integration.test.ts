import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';

describe('US2 pane navigation flow', () => {
  const parser = new ReviewParser();

  it('returns empty entries when no comments exist', () => {
    expect(parser.buildCommentEntries('plain text')).toHaveLength(0);
  });

  it('returns entries with location fields for comments', () => {
    const entries = parser.buildCommentEntries('# H\nText {>> [author=A] note <<}');
    expect(entries).toHaveLength(1);
    expect(entries[0].from).toBeGreaterThanOrEqual(0);
    expect(entries[0].line).toBe(2);
  });
});
