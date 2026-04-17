import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { describe, expect, it } from 'vitest';
import { ReviewParser } from '../../src/review-parser';

describe('US3 pane refresh benchmark', () => {
  const parser = new ReviewParser();

  it('keeps pane refresh under 500ms for 50 review tokens', () => {
    const targetTokenCount = 50;
    const tokens: string[] = [];

    for (let index = 0; index < targetTokenCount; index += 1) {
      tokens.push(`{==text-${index}==}{>> [author=A] c-${index} <<}`);
    }
    const doc = tokens.join('\n');

    const start = performance.now();
    const entries = parser.buildCommentEntries(doc);
    const elapsedMs = performance.now() - start;

    writeFileSync(
      'artifacts/metrics/sc002-pane-refresh.json',
      JSON.stringify(
        { tokenCount: targetTokenCount, entryCount: entries.length, elapsedMs },
        null,
        2
      )
    );

    expect(elapsedMs).toBeLessThanOrEqual(500);
    expect(entries.length).toBe(targetTokenCount);
  });
});
