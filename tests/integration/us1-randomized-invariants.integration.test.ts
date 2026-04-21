import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';
import { TrackChangesService } from '../../src/track-changes';

function createRng(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0xffffffff;
  };
}

describe('us1 randomized invariants', () => {
  it('preserves parser and range invariants across randomized edit sequences', () => {
    const rng = createRng(20260421);
    const service = new TrackChangesService();
    const parser = new ReviewParser();

    let content = 'Alpha beta gamma.';

    for (let step = 0; step < 250; step += 1) {
      const len = content.length;
      const from = Math.floor(rng() * (len + 1));
      const span = Math.floor(rng() * Math.max(1, len - from + 1));
      const to = Math.min(len, from + span);

      const mode = Math.floor(rng() * 3);
      let inserted = '';
      if (mode === 0) {
        inserted = String.fromCharCode(97 + Math.floor(rng() * 26));
      } else if (mode === 1) {
        inserted = '';
      } else {
        inserted = `w${Math.floor(rng() * 9)}`;
      }

      const result = service.applyTrackedEdit(content, from, to, inserted);
      if (result) {
        content = result.content;
      } else {
        content = `${content.slice(0, from)}${inserted}${content.slice(to)}`;
      }

      const tokens = parser.parseTokens(content);
      for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i];
        expect(token.from).toBeGreaterThanOrEqual(0);
        expect(token.to).toBeGreaterThan(token.from);
        expect(token.to).toBeLessThanOrEqual(content.length);
        if (i > 0) {
          expect(tokens[i - 1].to).toBeLessThanOrEqual(token.from);
        }
      }
    }
  });
});
