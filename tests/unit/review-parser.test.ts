import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';

describe('review-parser', () => {
  const parser = new ReviewParser();

  it('parses all core token types', () => {
    const input = '{++a++} {--b--} {~~old~>new~~} {==h==} x {>> [author=Dan] note <<}';
    const tokens = parser.parseTokens(input);
    expect(tokens.some((t) => t.type === 'addition')).toBe(true);
    expect(tokens.some((t) => t.type === 'deletion')).toBe(true);
    expect(tokens.some((t) => t.type === 'substitution')).toBe(true);
    expect(tokens.some((t) => t.type === 'highlight')).toBe(true);
    expect(tokens.some((t) => t.type === 'comment')).toBe(true);
  });

  it('detects anchored comment when highlight and comment are adjacent', () => {
    const tokens = parser.parseTokens('{==claim==} {>> [author=Dan] cite <<}');
    expect(tokens.some((t) => t.type === 'anchoredComment')).toBe(true);
  });

  it('does not anchor when non-whitespace exists in between', () => {
    const tokens = parser.parseTokens('{==claim==} then {>> [author=Dan] cite <<}');
    expect(tokens.some((t) => t.type === 'anchoredComment')).toBe(false);
    expect(tokens.filter((t) => t.type === 'highlight')).toHaveLength(1);
    expect(tokens.filter((t) => t.type === 'comment')).toHaveLength(1);
  });

  it('supports multiline comments when closed', () => {
    const tokens = parser.parseTokens('{>> [author=Dan] line 1\nline 2 <<}');
    const comment = tokens.find((t) => t.type === 'comment');
    expect(comment).toBeDefined();
  });

  it('parses empty addition tokens', () => {
    const tokens = parser.parseTokens('before {++++} after');
    const addition = tokens.find((t) => t.type === 'addition');
    expect(addition).toBeDefined();
    if (addition && addition.type === 'addition') {
      expect(addition.text).toBe('');
    }
  });

  it('ignores token-like content inside fenced code blocks', () => {
    const input = '```md\n{++x++} {>> [author=A] c <<}\n```';
    const tokens = parser.parseTokens(input);
    expect(tokens).toHaveLength(0);
  });

  it('treats nested token patterns conservatively as outer token only', () => {
    const tokens = parser.parseTokens('{==outer {++inner++} token==}');
    expect(tokens.filter((t) => t.type === 'highlight')).toHaveLength(1);
    expect(tokens.filter((t) => t.type === 'addition')).toHaveLength(0);
  });

  it('builds comment pane entries with heading and line context', () => {
    const input = '# Intro\nText {>> [author=Dan] note <<}\n';
    const entries = parser.buildCommentEntries(input);
    expect(entries).toHaveLength(1);
    expect(entries[0].heading).toBe('Intro');
    expect(entries[0].line).toBe(2);
    expect(entries[0].author).toBe('Dan');
  });

  it('builds tracked change entries with heading and line context', () => {
    const input = '# Intro\nA {++plus++} and {--minus--} and {~~old~>new~~}\n';
    const entries = parser.buildTrackedChangeEntries(input);

    expect(entries).toHaveLength(3);
    expect(entries[0].heading).toBe('Intro');
    expect(entries[0].line).toBe(2);
    expect(entries[0].context.length).toBeGreaterThan(0);
  });
});
