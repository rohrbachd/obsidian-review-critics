import { ItemView, Notice, type WorkspaceLeaf } from 'obsidian';
import { ReviewNotices, ReviewQuickActionsPaneText, ReviewViewIds } from './review-config';
import type { QuickActionType } from './review-types';

export class ReviewQuickActionsView extends ItemView {
  static readonly VIEW_TYPE = ReviewViewIds.QUICK_ACTIONS_PANE;

  private readonly onAction: (action: QuickActionType) => Promise<boolean>;

  constructor(leaf: WorkspaceLeaf, onAction: (action: QuickActionType) => Promise<boolean>) {
    super(leaf);
    this.onAction = onAction;
  }

  getViewType(): string {
    return ReviewQuickActionsView.VIEW_TYPE;
  }

  getDisplayText(): string {
    return ReviewQuickActionsPaneText.DISPLAY_TEXT;
  }

  getIcon(): string {
    return ReviewQuickActionsPaneText.ICON;
  }

  onOpen(): Promise<void> {
    this.render();
    return Promise.resolve();
  }

  onClose(): Promise<void> {
    this.contentEl.empty();
    return Promise.resolve();
  }

  private render(): void {
    this.contentEl.empty();
    this.contentEl.createEl('h3', { text: ReviewQuickActionsPaneText.TITLE });

    const actions: Array<{ id: QuickActionType; label: string }> = [
      { id: 'add', label: 'Add' },
      { id: 'delete', label: 'Delete' },
      { id: 'highlight', label: 'Highlight' },
      { id: 'replace', label: 'Replace' },
      { id: 'comment', label: 'Comment' },
    ];

    const row = this.contentEl.createDiv({ cls: 'review-quick-actions-row' });
    for (const action of actions) {
      const button = row.createEl('button', { text: action.label, attr: { type: 'button' } });
      button.addEventListener('click', () => {
        void this.handleAction(action.id);
      });
    }
  }

  private async handleAction(action: QuickActionType): Promise<void> {
    const applied = await this.onAction(action);
    if (!applied) {
      new Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
    }
  }
}
