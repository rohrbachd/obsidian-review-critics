import { describe, expect, it } from 'vitest';
import { EditorState } from '@codemirror/state';
import { TrackChangesExtensionFactory, TrackChangesService } from '../../src/track-changes';

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

  it('classifies syntax-sensitive protected markdown selections', () => {
    const fenced = '```ts\nconst x = 1;\n```';
    expect(service.isSelectionSyntaxSensitive(fenced, 7, 12)).toBe(true);

    const math = '$$\na+b\n$$';
    expect(service.isSelectionSyntaxSensitive(math, 3, 4)).toBe(true);

    const link = 'text [x](https://example.com) end';
    const from = link.indexOf('[x]');
    const to = from + '[x](https://example.com)'.length;
    expect(service.isSelectionSyntaxSensitive(link, from, to)).toBe(true);

    const footnote = 'line with ref [^1]\n\n[^1]: detail';
    const footnoteFrom = footnote.indexOf('[^1]');
    expect(service.isSelectionSyntaxSensitive(footnote, footnoteFrom, footnoteFrom + 4)).toBe(true);
  });

  it('does not classify normal heading/text selections as syntax-sensitive', () => {
    const heading = '# Heading';
    expect(service.isSelectionSyntaxSensitive(heading, 2, heading.length)).toBe(false);

    const plain = 'normal inline text';
    expect(service.isSelectionSyntaxSensitive(plain, 0, plain.length)).toBe(false);
  });

  it('bypasses tracked newline insertion immediately before a heading line', () => {
    const source = '## My synthesis in one sentence';
    const result = service.applyTrackedEdit(source, 0, 0, '\n');
    expect(result).toBeNull();
  });

  it('bypasses callout/hinweisblock insertions in track changes mode', () => {
    const source = '';
    const inserted = '> [!NOTE] Title\n> line 1\n> line 2';
    const result = service.applyTrackedEdit(source, 0, 0, inserted);
    expect(result).toBeNull();
  });

  it('emits bypass callback when transaction is skipped for protected syntax', () => {
    let bypassCount = 0;
    const factory = new TrackChangesExtensionFactory(service);
    const state = EditorState.create({
      doc: 'see [link](https://example.com)',
      extensions: [factory.createTransactionFilter(() => true, () => void (bypassCount += 1))],
    });

    state.update({
      changes: { from: 6, to: 10, insert: 'ref' },
    });

    expect(bypassCount).toBe(1);
  });

  it('tracks formatting-like multi-change edits as substitution', () => {
    const factory = new TrackChangesExtensionFactory(service);
    const state = EditorState.create({
      doc: 'bold',
      extensions: [factory.createTransactionFilter(() => true)],
    });

    const transaction = state.update({
      changes: [
        { from: 0, to: 0, insert: '**' },
        { from: 4, to: 4, insert: '**' },
      ],
    });

    expect(transaction.newDoc.toString()).toBe('{~~bold~>**bold**~~}');
  });

  it('exempts markdown strikethrough formatting toggles from tracked substitution', () => {
    const factory = new TrackChangesExtensionFactory(service);
    const state = EditorState.create({
      doc: 'bold',
      extensions: [factory.createTransactionFilter(() => true)],
    });

    const transaction = state.update({
      changes: [
        { from: 0, to: 0, insert: '~~' },
        { from: 4, to: 4, insert: '~~' },
      ],
    });

    expect(transaction.newDoc.toString()).toBe('~~bold~~');
  });
});
