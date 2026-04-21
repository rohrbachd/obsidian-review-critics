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

  it('uses addition instead of substitution for whitespace-only replacements', () => {
    const result = service.applyTrackedEdit('a     b', 1, 6, 'x');
    expect(result?.content).toBe('a{++x++}b');
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

  it('removes empty addition token when last characters are deleted in track mode', () => {
    const source = 'A {++x++} B';
    const from = source.indexOf('x');
    const result = service.applyTrackedEdit(source, from, from + 1, '');
    expect(result?.content).toBe('A  B');
  });

  it('keeps typing inside substitution new-text inside same substitution token', () => {
    const step1 = service.applyTrackedEdit('lets', 0, 4, 'n');
    expect(step1?.content).toBe('{~~lets~>n~~}');

    const step2 = service.applyTrackedEdit(step1?.content || '', 10, 10, 'o');
    expect(step2?.content).toBe('{~~lets~>no~~}');
  });

  it('does not create tracked deletion when deleting inside substitution new-text', () => {
    const source = '{~~replacement~>with something else~~}';
    const from = source.indexOf('hing');
    const result = service.applyTrackedEdit(source, from, from + 4, '');
    expect(result?.content).toBe('{~~replacement~>with somet else~~}');
    expect(result?.content.includes('{--')).toBe(false);
  });

  it('blocks edits in substitution old-text side', () => {
    const source = '{~~replacement~>with something else~~}';
    const insertAt = source.indexOf('replacement') + 3;
    const inserted = service.applyTrackedEdit(source, insertAt, insertAt, 'x');
    expect(inserted?.preventDefault).toBe(true);
    expect(inserted?.content).toBe(source);

    const deleteFrom = source.indexOf('replacement') + 1;
    const deleted = service.applyTrackedEdit(source, deleteFrom, deleteFrom + 2, '');
    expect(deleted?.preventDefault).toBe(true);
    expect(deleted?.content).toBe(source);
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

  it('skips transformation for structured multi-line replacements', () => {
    const source = '| a | b |\n|---|---|\n|   |   |';
    const from = source.indexOf('| a');
    const to = source.length;
    const result = service.applyTrackedEdit(source, from, to, source);
    expect(result).toBeNull();
  });

  it('skips track-changes transformation inside markdown table rows', () => {
    const source = '| A | B |\n| --- | --- |\n|   |   |';
    const cellSpace = source.indexOf('|   |   |') + 2;
    const result = service.applyTrackedEdit(source, cellSpace, cellSpace + 1, 'w');
    expect(result).toBeNull();
  });

  it('skips edits in table cells even when content already contains tracked tokens', () => {
    const source = '| A | B |\n| --- | --- |\n| {++w++} |   |';
    const from = source.indexOf('w');
    const result = service.applyTrackedEdit(source, from, from + 1, ' w   ');
    expect(result).toBeNull();
  });

  it('detects table context in post-change document for follow-up formatter edits', () => {
    const source = '| A | B |\n| --- | --- |\n| w |   |';
    const next = '| A | B |\n| --- | --- |\n|  w   |   |';
    const from = source.indexOf('w');
    const nextFrom = next.indexOf('w');

    const shouldSkip = service.shouldSkipTrackingForChange(
      source,
      from,
      from + 1,
      ' w   ',
      next,
      nextFrom,
      nextFrom + 5
    );

    expect(shouldSkip).toBe(true);
  });
});
