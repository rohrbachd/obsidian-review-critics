import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { describe, expect, it } from 'vitest';
import { ReviewMarkupBuilder } from '../../src/review-commands';

describe('US1 command action latency benchmark', () => {
  const builder = new ReviewMarkupBuilder();

  it('keeps average action latency under 15 seconds', () => {
    const iterations = 5000;
    const actionsPerIteration = 2;

    const start = performance.now();

    for (let index = 0; index < iterations; index += 1) {
      builder.createCommentMarkup('Dan');
      builder.createAnchoredCommentMarkup('claim', 'Dan');
    }

    const totalMs = performance.now() - start;
    const avgMs = totalMs / (iterations * actionsPerIteration);

    writeFileSync(
      'artifacts/metrics/sc001-command-latency.json',
      JSON.stringify({ iterations, totalMs, avgMs }, null, 2)
    );

    expect(avgMs).toBeLessThan(15000);
  });
});
