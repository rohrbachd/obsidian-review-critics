import { describe, expect, it } from 'vitest';
import { ReviewMarkupBuilder } from '../../src/review-commands';

describe('US1 command behavior', () => {
  const builder = new ReviewMarkupBuilder();

  it('creates standalone comment markup with author', () => {
    expect(builder.createCommentMarkup('Dan')).toContain('[author=Dan]');
  });

  it('creates anchored markup from selection', () => {
    expect(builder.createAnchoredCommentMarkup('claim', 'Dan')).toContain('{==claim==}');
  });

  it('wraps selections for addition and deletion', () => {
    expect(builder.wrapSelectionMarkup('x', '{++', '++}')).toBe('{++x++}');
    expect(builder.wrapSelectionMarkup('x', '{--', '--}')).toBe('{--x--}');
  });

  it('creates substitution template', () => {
    expect(builder.createSubstitutionMarkup('old')).toBe('{~~old~>~~}');
  });
});
