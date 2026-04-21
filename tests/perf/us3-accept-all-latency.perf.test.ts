import { describe, expect, it } from 'vitest';
import { ChangeResolutionService } from '../../src/change-resolution';

describe('us3 accept-all perf', () => {
  const service = new ChangeResolutionService();

  it('accepts 50 tracked changes under 10 seconds', () => {
    const token = '{++word++} {--gone--} {~~old~>new~~} ';
    const input = token.repeat(50);

    const started = performance.now();
    service.resolveAllTrackedChangesAsAccepted(input);
    const elapsedMs = performance.now() - started;

    expect(elapsedMs).toBeLessThan(10_000);
  });
});
