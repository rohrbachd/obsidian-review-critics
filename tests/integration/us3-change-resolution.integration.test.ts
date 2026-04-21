import { describe, expect, it } from 'vitest';
import { ChangeResolutionService } from '../../src/change-resolution';
import { ReviewParser } from '../../src/review-parser';

describe('us3 change resolution integration', () => {
  const service = new ChangeResolutionService();
  const parser = new ReviewParser();

  it('resolves a parsed single change entry', () => {
    const input = 'A {++new++} text';
    const entry = parser.buildTrackedChangeEntries(input)[0];
    const resolved = service.resolveTrackedChange(input, entry, 'accept');
    expect(resolved).toBe('A new text');
  });

  it('accepts all changes in one pass', () => {
    const input = '{++a++} {--b--} {~~old~>new~~}';
    const resolved = service.resolveAllTrackedChangesAsAccepted(input);
    expect(resolved).toBe('a  new');
  });
});
