import { describe, expect, it } from 'vitest';
import { TrackChangesService } from '../../src/track-changes';

describe('us1 track changes integration', () => {
  const service = new TrackChangesService();

  it('extends insertion while inside same addition', () => {
    const start = service.applyTrackedEdit('Alpha ', 6, 6, 'Beta');
    const next = service.applyTrackedEdit(start?.content || '', 11, 11, '!');
    expect(next?.content?.includes('!')).toBe(true);
    expect(next?.content?.match(/\{\+\+/g)?.length).toBe(1);
  });

  it('creates deletion and substitution tokens in sequence', () => {
    const deleted = service.applyTrackedEdit('one two three', 4, 7, '');
    const substituted = service.applyTrackedEdit(deleted?.content || '', 0, 3, '1');
    expect(deleted?.content).toContain('{--two--}');
    expect(substituted?.content).toContain('{~~one~>1~~}');
  });
});
