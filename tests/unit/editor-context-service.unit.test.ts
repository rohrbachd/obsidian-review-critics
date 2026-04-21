import { describe, expect, it } from 'vitest';
import { MarkdownView } from 'obsidian';
import { EditorContextService } from '../../src/review-commands';

describe('editor-context-service', () => {
  it('falls back to most recent markdown leaf when active view is not markdown', () => {
    const editor = { id: 'editor' } as never;
    const markdownView = new MarkdownView({} as never);
    markdownView.editor = editor;

    const service = new EditorContextService({
      getActiveViewOfType: () => null,
      getMostRecentLeaf: () => ({ view: markdownView }),
      getLeavesOfType: () => [],
    } as never);

    expect(service.getActiveMarkdownEditor()).toBe(editor);
  });

  it('falls back to first markdown leaf when no active or recent markdown leaf exists', () => {
    const editor = { id: 'editor' } as never;
    const markdownView = new MarkdownView({} as never);
    markdownView.editor = editor;

    const service = new EditorContextService({
      getActiveViewOfType: () => null,
      getMostRecentLeaf: () => null,
      getLeavesOfType: () => [{ view: markdownView }],
    } as never);

    expect(service.getActiveMarkdownEditor()).toBe(editor);
  });
});
