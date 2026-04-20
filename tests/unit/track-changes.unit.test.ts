import { describe, expect, it } from 'vitest';
import { TrackChangesService } from '../../src/track-changes';

describe('track-changes', () => {
  const service = new TrackChangesService();

  it('wraps plain insertion as addition', () => {
    const result = service.applyTrackedEdit('hello', 5, 5, ' world');
    expect(result?.content).toBe('hello{++ world++}');
  });

  it('creates substitution for replacement selection', () => {
    const result = service.applyTrackedEdit('hello world', 6, 11, 'team');
    expect(result?.content).toBe('hello {~~world~>team~~}');
  });

  it('wraps deletion and merges adjacent deletions', () => {
    const merged = service.applyTrackedEdit('ab{--c--}d', 1, 2, '');
    expect(merged?.content).toContain('{--bc--}');
    expect(merged?.content?.match(/\{--/g)?.length).toBe(1);
  });

  it('blocks unsafe delimiter-overlap edits', () => {
    const unsafe = service.applyTrackedEdit('{++abc++}', 0, 4, '');
    expect(unsafe?.preventDefault).toBe(true);
    expect(unsafe?.content).toBe('{++abc++}');
  });

  it('blocks insertion inside delimiter characters', () => {
    const unsafe = service.applyTrackedEdit('{--abc--}', 1, 1, 'x');
    expect(unsafe?.preventDefault).toBe(true);
    expect(unsafe?.content).toBe('{--abc--}');
  });

  it('does not create deletion when deleting inside an addition token', () => {
    const result = service.applyTrackedEdit('{++hello++}', 4, 5, '');
    expect(result?.content).toBe('{++hllo++}');
  });

  it('keeps typing inside substitution new-text inside same substitution token', () => {
    const step1 = service.applyTrackedEdit('lets', 0, 4, 'n');
    expect(step1?.content).toBe('{~~lets~>n~~}');

    const step2 = service.applyTrackedEdit(step1?.content || '', 10, 10, 'o');
    expect(step2?.content).toBe('{~~lets~>no~~}');
  });

  it('splits a deletion token when inserting inside it', () => {
    const result = service.applyTrackedEdit('{--this is a longer--}', 11, 11, 'a');
    expect(result?.content).toBe('{--this is --}{++a++}{--a longer--}');
    expect(result?.cursor).toBe('{--this is --}{++a'.length);
  });

  it('does not create nested deletions when deleting inside a deletion token', () => {
    const result = service.applyTrackedEdit('{--This --}', 3, 4, '');
    expect(result?.content).toBe('{--This --}');
    expect(result?.preventDefault).toBe(true);
  });

  it('does not track edits inside comment tokens', () => {
    const source = '{==Things==}{>> [author=Daniel Rohrbach] Need changes <<}';
    const insertAt = source.indexOf('Need');
    const result = service.applyTrackedEdit(
      source,
      insertAt,
      insertAt,
      'x'
    );
    expect(result?.content).toBe('{==Things==}{>> [author=Daniel Rohrbach] xNeed changes <<}');
  });

  it('deletes plain text inside comment token without creating tracked deletion', () => {
    const source = '{>> [author=Dan] Hello <<}';
    const from = source.indexOf('e');
    const result = service.applyTrackedEdit(source, from, from + 1, '');
    expect(result?.content).toBe('{>> [author=Dan] Hllo <<}');
    expect(result?.content.includes('{--')).toBe(false);
  });

  it('does not track insertion into trailing whitespace before comment close', () => {
    const source = '{>> [author=Dan] hello  <<}';
    const insertAt = source.indexOf('<<}') - 1;
    const result = service.applyTrackedEdit(source, insertAt, insertAt, 'x');
    expect(result?.content).toBe('{>> [author=Dan] hello x <<}');
    expect(result?.content.includes('{++')).toBe(false);
  });

  it('does not track first insertion into empty authored comment body', () => {
    const source = '{>> [author=Dan]  <<}';
    const insertAt = source.indexOf('<<}') - 2;
    const result = service.applyTrackedEdit(source, insertAt, insertAt, 'w');
    expect(result?.content).toBe('{>> [author=Dan]w  <<}');
    expect(result?.content.includes('{++')).toBe(false);
  });

  it('supports one-shot suppression for command-driven edits', () => {
    expect(service.consumeSuppressedTransaction()).toBe(false);
    service.suppressNextTransaction();
    expect(service.consumeSuppressedTransaction()).toBe(true);
    expect(service.consumeSuppressedTransaction()).toBe(false);
  });
});
