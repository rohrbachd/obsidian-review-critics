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

  it('tracks normal heading text edits (not protected syntax)', () => {
    const source = '# Heading';
    const result = service.applyTrackedEdit(source, source.length, source.length, '!');
    expect(result?.content).toContain('{++!++}');
  });

  it('bypasses full transaction when mixed selection contains protected syntax', () => {
    const source = 'safe text [x](https://example.com)';
    const from = 0;
    const to = source.length;
    const result = service.applyTrackedEdit(source, from, to, 'replacement');
    expect(result).toBeNull();
  });
});
