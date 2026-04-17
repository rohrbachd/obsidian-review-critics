import { describe, expect, it } from 'vitest';
import { ReviewSyntaxCatalog } from '../../src/review-constants';

describe('review constants', () => {
  it('defines token regexes and helper patterns', () => {
    const syntax = new ReviewSyntaxCatalog();

    expect(syntax.rules.tokenPatterns.addition.test('{++x++}')).toBe(true);
    expect(syntax.rules.headingPattern.test('# Heading')).toBe(true);
    expect(syntax.rules.fencePattern.test('```ts')).toBe(true);
    expect(syntax.rules.anchoredWhitespacePattern.test('   \n')).toBe(true);
  });
});
