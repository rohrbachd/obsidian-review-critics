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

describe('cursor offset helpers', () => {
  const builder = new ReviewMarkupBuilder();

  it('positions cursor inside standalone comment (no author)', () => {
    const markup = builder.createCommentMarkup('');
    const offset = builder.commentCursorOffset(markup);
    expect(markup[offset]).toBe(' ');
    expect(markup.slice(offset)).toBe(' <<}');
  });

  it('positions cursor inside standalone comment (with author)', () => {
    const markup = builder.createCommentMarkup('Konrad');
    const offset = builder.commentCursorOffset(markup);
    expect(markup[offset]).toBe(' ');
    expect(markup.slice(offset)).toBe(' <<}');
  });

  it('positions cursor inside anchored comment', () => {
    const markup = builder.createAnchoredCommentMarkup('selected text', 'Dan');
    const offset = builder.commentCursorOffset(markup);
    expect(markup[offset]).toBe(' ');
    expect(markup.slice(offset)).toBe(' <<}');
    expect(markup.slice(0, 20)).toContain('{==selected text==}');
  });

  it('positions cursor inside substitution replacement slot', () => {
    const markup = builder.createSubstitutionMarkup('old text');
    // {~~old text~>~~} — cursor right after ~>
    const offset = builder.substitutionCursorOffset(markup);
    expect(markup.slice(offset)).toBe('~~}');
    expect(markup.slice(offset - 2, offset)).toBe('~>');
  });
});
