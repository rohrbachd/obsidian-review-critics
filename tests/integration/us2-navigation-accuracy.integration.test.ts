import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';

describe('US2 navigation accuracy metrics', () => {
  const parser = new ReviewParser();

  it('measures first-click navigation mapping accuracy for parsed entries', () => {
    const doc = [
      '# H',
      '{==a==}{>> [author=A] c1 <<}',
      '{==b==}{>> [author=B] c2 <<}',
      '{>> [author=C] c3 <<}',
    ].join('\n');

    const entries = parser.buildCommentEntries(doc);
    const correct = entries.filter((entry) => doc.slice(entry.from, entry.to).length > 0).length;
    const total = entries.length;
    const accuracy = total === 0 ? 0 : correct / total;

    writeFileSync(
      'artifacts/metrics/sc003-navigation-accuracy.json',
      JSON.stringify({ total, correct, accuracy }, null, 2)
    );

    expect(accuracy).toBeGreaterThanOrEqual(0.95);
  });
});
