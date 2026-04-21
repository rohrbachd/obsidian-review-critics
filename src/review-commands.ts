import { ReviewMarkupSyntax } from './review-config';
import type { IReviewMarkupBuilder } from './review-types';
import { type Editor, MarkdownView, type Workspace } from 'obsidian';

export class ReviewMarkupBuilder implements IReviewMarkupBuilder {
  createCommentMarkup(authorName: string): string {
    const author = authorName.trim();

    if (!author) {
      return `${ReviewMarkupSyntax.COMMENT_PREFIX}${ReviewMarkupSyntax.COMMENT_PADDING}${ReviewMarkupSyntax.COMMENT_SUFFIX}`;
    }

    return `${ReviewMarkupSyntax.COMMENT_PREFIX} ${ReviewMarkupSyntax.AUTHOR_PREFIX}${author}${ReviewMarkupSyntax.AUTHOR_SUFFIX}${ReviewMarkupSyntax.COMMENT_PADDING}${ReviewMarkupSyntax.COMMENT_SUFFIX}`;
  }

  createAnchoredCommentMarkup(selection: string, authorName: string): string {
    const highlight = `${ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_PREFIX}${selection}${ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_SUFFIX}`;
    return `${highlight}${this.createCommentMarkup(authorName)}`;
  }

  wrapSelectionMarkup(selection: string, prefix: string, suffix: string): string {
    return `${prefix}${selection}${suffix}`;
  }

  createSubstitutionMarkup(selection: string): string {
    return `${ReviewMarkupSyntax.SUBSTITUTION_PREFIX}${selection}${ReviewMarkupSyntax.SUBSTITUTION_MIDDLE}${ReviewMarkupSyntax.SUBSTITUTION_SUFFIX}`;
  }
}

export interface IEditorContextService {
  getActiveMarkdownEditor(): Editor | null;
  getEditorSelectionBounds(editor: Editor): { from: number; to: number } | null;
}

export class EditorContextService implements IEditorContextService {
  private readonly workspace: Workspace;

  constructor(workspace: Workspace) {
    this.workspace = workspace;
  }

  getActiveMarkdownEditor(): Editor | null {
    const activeView = this.workspace.getActiveViewOfType(MarkdownView);
    if (activeView?.editor) {
      return activeView.editor;
    }

    const recentLeaf = this.workspace.getMostRecentLeaf();
    if (recentLeaf?.view instanceof MarkdownView && recentLeaf.view.editor) {
      return recentLeaf.view.editor;
    }

    const markdownLeaf = this.workspace.getLeavesOfType('markdown')[0] ?? null;
    if (markdownLeaf?.view instanceof MarkdownView && markdownLeaf.view.editor) {
      return markdownLeaf.view.editor;
    }

    return null;
  }

  getEditorSelectionBounds(editor: Editor): { from: number; to: number } | null {
    if (typeof editor.posToOffset !== 'function') {
      return null;
    }

    const from = editor.posToOffset(editor.getCursor('from'));
    const to = editor.posToOffset(editor.getCursor('to'));
    return { from: Math.min(from, to), to: Math.max(from, to) };
  }
}
