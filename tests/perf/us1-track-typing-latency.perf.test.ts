import { describe, expect, it } from 'vitest';
import { TrackChangesService } from '../../src/track-changes';

describe('us1 track typing perf', () => {
  const service = new TrackChangesService();

  it('keeps p95 tracked-edit latency at or below 50ms', () => {
    let content = 'seed ';
    const latenciesMs: number[] = [];

    for (let i = 0; i < 200; i += 1) {
      const editStart = performance.now();
      const result = service.applyTrackedEdit(content, content.length, content.length, 'x');
      latenciesMs.push(performance.now() - editStart);
      content = result?.content ?? content;
    }

    const sortedLatencies = [...latenciesMs].sort((a, b) => a - b);
    const p95Index = Math.max(0, Math.ceil(sortedLatencies.length * 0.95) - 1);
    const p95LatencyMs = sortedLatencies[p95Index];

    expect(p95LatencyMs).toBeLessThanOrEqual(50);
  });
});
