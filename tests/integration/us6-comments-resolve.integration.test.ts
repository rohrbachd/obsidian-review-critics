import { describe, expect, it } from 'vitest';
import { ChangeResolutionService } from '../../src/change-resolution';
import type { CommentPaneEntry } from '../../src/review-types';

describe('us6 comments resolve integration', () => {
  const service = new ChangeResolutionService();

  it('removes standalone comment markup', () => {
    const input = 'Text {>> [author=A] note <<} end';
    const entry: CommentPaneEntry = {
      id: 'c1',
      from: 5,
      to: 28,
      line: 1,
      heading: 'Root',
      commentText: 'note',
      canResolve: true,
      commentFrom: 5,
      commentTo: 28,
    };
    const resolved = service.resolveCommentEntry(input, entry);
    expect(resolved).toBe('Text  end');
  });

  it('resolves anchored comments and preserves reviewed text', () => {
    const input = '{==Claim==}{>> [author=A] source? <<}';
    const entry: CommentPaneEntry = {
      id: 'a1',
      from: 0,
      to: input.length,
      line: 1,
      heading: 'Root',
      commentText: 'source?',
      highlightedText: 'Claim',
      isAnchored: true,
      canResolve: true,
      commentFrom: 11,
      commentTo: input.length,
    };
    const resolved = service.resolveCommentEntry(input, entry);
    expect(resolved).toBe('Claim');
  });
});
