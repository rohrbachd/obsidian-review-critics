import { describe, expect, it } from 'vitest';
import { TrackChangesService } from '../../src/track-changes';

describe('us1 track typing perf', () => {
  const service = new TrackChangesService();

  it('processes repeated insertions in a bounded time', () => {
    let content = 'seed ';
    const startedAt = performance.now();

    for (let i = 0; i < 200; i += 1) {
      const result = service.applyTrackedEdit(content, content.length, content.length, 'x');
      content = result?.content ?? content;
    }

    const elapsedMs = performance.now() - startedAt;
    expect(elapsedMs).toBeLessThan(500);
  });
});
