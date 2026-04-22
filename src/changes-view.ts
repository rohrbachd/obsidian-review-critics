import { ItemView, Notice, type WorkspaceLeaf } from 'obsidian';
import { ReviewChangesPaneText, ReviewNotices, ReviewViewIds } from './review-config';
import type { QuickActionType, TrackedChangeEntry } from './review-types';

export class ReviewChangesView extends ItemView {
  static readonly VIEW_TYPE = ReviewViewIds.CHANGES_PANE;

  private entries: TrackedChangeEntry[] = [];
  private onNavigate: (entry: TrackedChangeEntry) => Promise<void>;
  private onAccept: (entry: TrackedChangeEntry) => Promise<void>;
  private onReject: (entry: TrackedChangeEntry) => Promise<void>;
  private onAcceptAll: () => Promise<void>;
  private onQuickAction: (action: QuickActionType) => Promise<boolean>;
  private onToggleTrackChanges: () => Promise<void>;
  private onToggleAcceptedTextView: () => Promise<void>;
  private isTrackChangesEnabled: () => boolean;
  private isAcceptedTextViewEnabled: () => boolean;
  private isBusy: () => boolean;
  private pendingEntryIds = new Set<string>();
  private acceptAllPending = false;
  private localBusy = false;

  constructor(
    leaf: WorkspaceLeaf,
    onNavigate: (entry: TrackedChangeEntry) => Promise<void>,
    onAccept: (entry: TrackedChangeEntry) => Promise<void>,
    onReject: (entry: TrackedChangeEntry) => Promise<void>,
    onAcceptAll: () => Promise<void>,
    onQuickAction: (action: QuickActionType) => Promise<boolean>,
    onToggleTrackChanges: () => Promise<void>,
    onToggleAcceptedTextView: () => Promise<void>,
    isTrackChangesEnabled: () => boolean,
    isAcceptedTextViewEnabled: () => boolean,
    isBusy: () => boolean
  ) {
    super(leaf);
    this.onNavigate = onNavigate;
    this.onAccept = onAccept;
    this.onReject = onReject;
    this.onAcceptAll = onAcceptAll;
    this.onQuickAction = onQuickAction;
    this.onToggleTrackChanges = onToggleTrackChanges;
    this.onToggleAcceptedTextView = onToggleAcceptedTextView;
    this.isTrackChangesEnabled = isTrackChangesEnabled;
    this.isAcceptedTextViewEnabled = isAcceptedTextViewEnabled;
    this.isBusy = isBusy;
  }

  getViewType(): string {
    return ReviewChangesView.VIEW_TYPE;
  }

  getDisplayText(): string {
    return ReviewChangesPaneText.DISPLAY_TEXT;
  }

  getIcon(): string {
    return ReviewChangesPaneText.ICON;
  }

  onOpen(): void {
    this.render();
  }

  onClose(): void {
    this.contentEl.empty();
  }

  setEntries(entries: TrackedChangeEntry[]): void {
    this.entries = entries;
    this.render();
  }

  private render(): void {
    this.contentEl.empty();
    this.contentEl.createEl('h3', { text: ReviewChangesPaneText.TITLE });

    const toolbar = this.contentEl.createDiv({ cls: 'review-changes-toolbar' });
    const actionsRow = toolbar.createDiv({ cls: 'review-quick-actions-row' });
    const actions: Array<{ id: QuickActionType; label: string }> = [
      { id: 'add', label: 'Add' },
      { id: 'delete', label: 'Delete' },
      { id: 'highlight', label: 'Highlight' },
      { id: 'replace', label: 'Replace' },
      { id: 'comment', label: 'Comment' },
    ];

    for (const action of actions) {
      const button = actionsRow.createEl('button', {
        text: action.label,
        attr: { type: 'button' },
      });
      button.addEventListener('mousedown', (event) => event.preventDefault());
      button.disabled = this.isUiBusy();
      button.addEventListener('click', () => {
        void this.handleQuickAction(action.id);
      });
    }

    const controlsRow = toolbar.createDiv({ cls: 'review-changes-controls-row' });
    const trackButton = controlsRow.createEl('button', {
      text: this.isTrackChangesEnabled() ? 'Track Changes: On' : 'Track Changes: Off',
      attr: { type: 'button' },
      cls: 'review-track-toggle',
    });
    trackButton.addEventListener('mousedown', (event) => event.preventDefault());
    trackButton.addEventListener('click', () => {
      void this.handleToggleTrackChanges();
    });
    trackButton.disabled = this.isUiBusy();

    const acceptedButton = controlsRow.createEl('button', {
      text: this.isAcceptedTextViewEnabled() ? 'Accepted View: On' : 'Accepted View: Off',
      attr: { type: 'button' },
      cls: 'review-accepted-toggle',
    });
    acceptedButton.addEventListener('mousedown', (event) => event.preventDefault());
    acceptedButton.addEventListener('click', () => {
      void this.handleToggleAcceptedTextView();
    });
    acceptedButton.disabled = this.isUiBusy();

    const acceptAllButton = controlsRow.createEl('button', {
      text: this.acceptAllPending ? 'Working...' : 'Accept All',
      attr: { type: 'button' },
      cls: 'review-changes-accept-all',
    });
    acceptAllButton.addEventListener('mousedown', (event) => event.preventDefault());
    acceptAllButton.disabled = this.acceptAllPending || this.isUiBusy();
    acceptAllButton.addEventListener('click', () => {
      void this.handleAcceptAll();
    });

    this.contentEl.createDiv({ cls: 'review-pane-separator' });

    if (this.entries.length === 0) {
      this.contentEl.createEl('p', { text: ReviewChangesPaneText.EMPTY_STATE });
      return;
    }

    const list = this.contentEl.createDiv({ cls: 'review-changes-list' });
    for (const entry of this.entries) {
      const button = list.createEl('button', {
        cls: 'review-changes-item',
        attr: { type: 'button' },
      });
      button.disabled = this.isUiBusy();
      button.createDiv({ text: `${entry.type} - line ${entry.line}` });
      button.createDiv({ text: entry.context });
      button.addEventListener('click', () => {
        void this.onNavigate(entry);
      });

      const actions = list.createDiv({ cls: 'review-changes-item-actions' });
      const isPending = this.pendingEntryIds.has(entry.id);
      const acceptButton = actions.createEl('button', {
        text: isPending ? 'Working...' : 'Accept',
        attr: { type: 'button' },
      });
      acceptButton.addEventListener('mousedown', (event) => event.preventDefault());
      acceptButton.disabled = isPending || this.isUiBusy();
      acceptButton.addEventListener('click', (event) => {
        event.stopPropagation();
        void this.handleEntryAction(entry, 'accept');
      });

      const rejectButton = actions.createEl('button', { text: 'Reject', attr: { type: 'button' } });
      rejectButton.addEventListener('mousedown', (event) => event.preventDefault());
      rejectButton.disabled = isPending || this.isUiBusy();
      rejectButton.addEventListener('click', (event) => {
        event.stopPropagation();
        void this.handleEntryAction(entry, 'reject');
      });
    }
  }

  private async handleQuickAction(action: QuickActionType): Promise<void> {
    if (this.isUiBusy()) {
      return;
    }
    this.localBusy = true;
    this.render();
    const applied = await this.onQuickAction(action);
    this.localBusy = false;
    this.render();
    if (!applied) {
      new Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
    }
  }

  private async handleToggleTrackChanges(): Promise<void> {
    if (this.isUiBusy()) {
      return;
    }
    this.localBusy = true;
    this.render();
    await this.onToggleTrackChanges();
    this.localBusy = false;
    this.render();
  }

  private async handleToggleAcceptedTextView(): Promise<void> {
    if (this.isUiBusy()) {
      return;
    }
    this.localBusy = true;
    this.render();
    await this.onToggleAcceptedTextView();
    this.localBusy = false;
    this.render();
  }

  private async handleAcceptAll(): Promise<void> {
    if (this.acceptAllPending || this.isUiBusy()) {
      return;
    }

    this.acceptAllPending = true;
    this.render();
    try {
      await this.onAcceptAll();
    } finally {
      this.acceptAllPending = false;
      this.render();
    }
  }

  private async handleEntryAction(
    entry: TrackedChangeEntry,
    action: 'accept' | 'reject'
  ): Promise<void> {
    if (this.pendingEntryIds.has(entry.id) || this.isUiBusy()) {
      return;
    }

    this.pendingEntryIds.add(entry.id);
    this.localBusy = true;
    this.render();
    try {
      if (action === 'accept') {
        await this.onAccept(entry);
      } else {
        await this.onReject(entry);
      }
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
