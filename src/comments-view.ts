import { ItemView, type WorkspaceLeaf } from 'obsidian';
import { ReviewCommentsPaneText, ReviewViewIds } from './review-config';
import type { CommentPaneEntry } from './review-types';

export class ReviewCommentsView extends ItemView {
  static readonly VIEW_TYPE = ReviewViewIds.COMMENTS_PANE;

  private entries: CommentPaneEntry[] = [];
  private onNavigate: (entry: CommentPaneEntry) => Promise<void>;

  constructor(leaf: WorkspaceLeaf, onNavigate: (entry: CommentPaneEntry) => Promise<void>) {
    super(leaf);
    this.onNavigate = onNavigate;
  }

  getViewType(): string {
    return ReviewCommentsView.VIEW_TYPE;
  }

  getDisplayText(): string {
    return ReviewCommentsPaneText.DISPLAY_TEXT;
  }

  getIcon(): string {
    return ReviewCommentsPaneText.ICON;
  }

  async onOpen(): Promise<void> {
    this.render();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
  }

  setEntries(entries: CommentPaneEntry[]): void {
    this.entries = entries;
    this.render();
  }

  private render(): void {
    const root = this.contentEl;
    root.empty();
    root.addClass('review-comments-pane');

    root.createEl('h3', { text: ReviewCommentsPaneText.TITLE });

    if (this.entries.length === 0) {
      root.createEl('p', {
        cls: 'review-comments-empty',
        text: ReviewCommentsPaneText.EMPTY_STATE,
      });
      return;
    }

    const list = root.createEl('div', { cls: 'review-comments-list' });

    this.entries.forEach((entry) => {
      const item = list.createEl('button', {
        cls: 'review-comments-item',
        attr: { type: 'button' },
      });

      const heading = item.createEl('div', { cls: 'review-comments-item-heading' });
      heading.createSpan({ text: entry.author || ReviewCommentsPaneText.UNKNOWN_AUTHOR });
      heading.createSpan({ text: `${ReviewCommentsPaneText.LINE_PREFIX}${entry.line}` });

      item.createEl('div', {
        cls: 'review-comments-item-body',
        text: entry.commentText || ReviewCommentsPaneText.EMPTY_COMMENT,
      });

      if (entry.highlightedText) {
        item.createEl('div', {
          cls: 'review-comments-item-snippet',
          text: `${ReviewCommentsPaneText.SNIPPET_PREFIX}${entry.highlightedText}${ReviewCommentsPaneText.SNIPPET_SUFFIX}`,
        });
      }

      item.createEl('div', {
        cls: 'review-comments-item-context',
        text: `${ReviewCommentsPaneText.SECTION_PREFIX}${entry.heading}`,
      });

      item.addEventListener('click', () => {
        void this.onNavigate(entry);
      });
    });
  }
}
