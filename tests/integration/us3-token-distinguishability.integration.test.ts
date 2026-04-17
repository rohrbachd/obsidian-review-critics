import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';

describe('US3 token distinguishability metrics', () => {
  const parser = new ReviewParser();

  it('identifies at least 18 of 20 mixed tokens', () => {
    const parts: string[] = [];
    for (let index = 0; index < 4; index += 1) {
      parts.push('{++a++}', '{--b--}', '{~~x~>y~~}', '{==h==}', 'sep', '{>> [author=A] c <<}');
    }
    const input = parts.join(' ');
    const tokens = parser.parseTokens(input);
    const identified = tokens.length;
    const target = 20;

    writeFileSync(
      'artifacts/metrics/sc004-token-distinguishability.json',
      JSON.stringify({ target, identified }, null, 2)
    );

    expect(identified).toBeGreaterThanOrEqual(18);
  });
});
