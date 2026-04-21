import { ItemView, type WorkspaceLeaf } from 'obsidian';
import { ReviewCommentsPaneText, ReviewViewIds } from './review-config';
import type { CommentPaneEntry } from './review-types';

export class ReviewCommentsView extends ItemView {
  static readonly VIEW_TYPE = ReviewViewIds.COMMENTS_PANE;

  private entries: CommentPaneEntry[] = [];
  private onNavigate: (entry: CommentPaneEntry) => Promise<void>;
  private onResolve: (entry: CommentPaneEntry) => Promise<void>;
  private isBusy: () => boolean;
  private pendingEntryIds = new Set<string>();
  private localBusy = false;

  constructor(
    leaf: WorkspaceLeaf,
    onNavigate: (entry: CommentPaneEntry) => Promise<void>,
    onResolve: (entry: CommentPaneEntry) => Promise<void>,
    isBusy: () => boolean
  ) {
    super(leaf);
    this.onNavigate = onNavigate;
    this.onResolve = onResolve;
    this.isBusy = isBusy;
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
      item.disabled = this.isUiBusy();

      const heading = item.createEl('div', { cls: 'review-comments-item-heading' });
      heading.createSpan({
        text: `${entry.author || ReviewCommentsPaneText.UNKNOWN_AUTHOR} • ${ReviewCommentsPaneText.LINE_PREFIX}${entry.line}`,
      });

      item.createEl('div', {
        cls: 'review-comments-item-body',
        text: `Comment: ${entry.commentText || ReviewCommentsPaneText.EMPTY_COMMENT}`,
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

      if (entry.canResolve) {
        const actions = item.createEl('div', { cls: 'review-comments-item-actions' });
        const resolveButton = actions.createEl('button', {
          cls: 'review-comments-resolve-button',
          attr: { type: 'button' },
          text: this.pendingEntryIds.has(entry.id) ? 'Working...' : 'Resolve',
        });
        resolveButton.disabled = this.pendingEntryIds.has(entry.id) || this.isUiBusy();
        resolveButton.addEventListener('click', (event) => {
          event.stopPropagation();
          void this.handleResolve(entry);
        });
      }
    });
  }

  private async handleResolve(entry: CommentPaneEntry): Promise<void> {
    if (this.pendingEntryIds.has(entry.id) || this.isUiBusy()) {
      return;
    }

    this.pendingEntryIds.add(entry.id);
    this.localBusy = true;
    this.render();
    try {
      await this.onResolve(entry);
    } finally {
      this.pendingEntryIds.delete(entry.id);
      this.localBusy = false;
      this.render();
    }
  }

  private isUiBusy(): boolean {
    return this.localBusy || this.isBusy();
  }
}
