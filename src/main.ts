import {
  type App,
  type Editor,
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  type TFile,
  type WorkspaceLeaf,
} from 'obsidian';
import { ReviewCommentsView } from './comments-view';
import { ChangeResolutionService } from './change-resolution';
import { ReviewChangesView } from './changes-view';
import {
  ReviewCommands,
  ReviewCssClasses,
  ReviewCssVariables,
  ReviewDefaults,
  ReviewDocumentKeys,
  ReviewNotices,
  ReviewSettingsText,
  ReviewViewIds,
  ReviewWorkspaceEvents,
  ReviewMarkupSyntax,
} from './review-config';
import { ReviewLivePreviewExtensionFactory } from './live-preview';
import { EditorContextService, ReviewMarkupBuilder } from './review-commands';
import { ReviewParser } from './review-parser';
import { ReviewReadingViewDecorator } from './reading-view';
import { ThemePresetService } from './theme-presets';
import { TrackChangesExtensionFactory, TrackChangesService } from './track-changes';
import type {
  CommentPaneEntry,
  ReviewColorSettings,
  ReviewPluginSettings,
  QuickActionType,
  ThemePreset,
  TrackedChangeEntry,
} from './review-types';

export default class ReviewPlugin extends Plugin {
  settings!: ReviewPluginSettings;
  private commandInFlight = false;
  private bypassNoticeShownThisSession = false;

  private readonly parser = new ReviewParser();
  private readonly markupBuilder = new ReviewMarkupBuilder();
  private readonly readingViewDecorator = new ReviewReadingViewDecorator(this.parser);
  private readonly livePreviewFactory = new ReviewLivePreviewExtensionFactory(this.parser);
  private readonly trackChangesService = new TrackChangesService();
  private readonly trackChangesFactory = new TrackChangesExtensionFactory(this.trackChangesService);
  private readonly editorContextService = new EditorContextService(this.app.workspace);
  private readonly changeResolutionService = new ChangeResolutionService();
  private readonly themePresetService = new ThemePresetService();

  async onload(): Promise<void> {
    await this.loadSettings();
    this.applyCssVariables();

    this.registerView(
      ReviewCommentsView.VIEW_TYPE,
      (leaf: WorkspaceLeaf) =>
        new ReviewCommentsView(
          leaf,
          async (entry) => this.navigateToComment(entry),
          async (entry) => {
            await this.runCommandExclusive(async () => {
              await this.resolveCommentEntry(entry);
            }, true);
          },
          () => this.commandInFlight
        )
    );

    this.registerView(
      ReviewChangesView.VIEW_TYPE,
      (leaf: WorkspaceLeaf) =>
        new ReviewChangesView(
          leaf,
          async (entry) => this.navigateToTrackedChange(entry),
          async (entry) => {
            await this.runCommandExclusive(async () => {
              await this.resolveTrackedChange(entry, 'accept');
            }, true);
          },
          async (entry) => {
            await this.runCommandExclusive(async () => {
              await this.resolveTrackedChange(entry, 'reject');
            }, true);
          },
          async () => {
            await this.runCommandExclusive(async () => {
              this.acceptAllTrackedChanges();
            }, true);
          },
          async (action) => {
            const result = await this.runCommandExclusive(
              async () => this.applyQuickAction(action),
              true
            );
            return result ?? false;
          },
          async () => {
            await this.runCommandExclusive(async () => {
              await this.toggleTrackChangesMode();
            }, true);
          },
          async () => {
            await this.runCommandExclusive(async () => {
              await this.toggleAcceptedTextView();
            }, true);
          },
          () => this.settings.trackChangesEnabled,
          () => this.settings.acceptedTextViewEnabled,
          () => this.commandInFlight
        )
    );

    this.registerMarkdownPostProcessor((element, context) => {
      try {
        this.readingViewDecorator.decorate(
          element,
          context,
          this.settings.enableReadingView,
          this.settings.acceptedTextViewEnabled
        );
      } catch (error) {
        console.error('[review-critic] Reading view decoration failed.', error);
      }
    });

    this.registerEditorExtension(
      this.livePreviewFactory.createExtension(
        () => this.settings.enableLivePreview,
        () => this.settings.acceptedTextViewEnabled
      )
    );
    this.registerEditorExtension(
      this.trackChangesFactory.createTransactionFilter(
        () => this.settings.trackChangesEnabled === true,
        () => this.showBypassNoticeOncePerSession()
      )
    );

    this.addCommands();
    this.registerEvents();
    this.addSettingTab(new ReviewSettingTab(this.app, this));

    await this.refreshCommentsPane();
    await this.refreshChangesPane();
  }

  onunload(): void {
    this.app.workspace.detachLeavesOfType(ReviewCommentsView.VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(ReviewChangesView.VIEW_TYPE);
  }

  private addCommands(): void {
    const runEditor = (handler: (editor: Editor) => Promise<void> | void) => {
      return (editor: Editor): void => {
        void this.runCommandExclusive(async () => {
          await handler(editor);
        });
      };
    };
    const runGlobal = (handler: () => Promise<void> | void) => {
      return (): void => {
        void this.runCommandExclusive(async () => {
          await handler();
        });
      };
    };

    this.addCommand({
      id: ReviewCommands.INSERT_COMMENT_ID,
      name: ReviewCommands.INSERT_COMMENT_NAME,
      editorCallback: runEditor(async (editor) => {
        const selection = editor.getSelection();
        if (selection) {
          this.replaceSelectionWithoutTrackChanges(
            editor,
            this.markupBuilder.createAnchoredCommentMarkup(selection, this.settings.authorName)
          );
        } else {
          this.replaceSelectionWithoutTrackChanges(
            editor,
            this.markupBuilder.createCommentMarkup(this.settings.authorName)
          );
        }
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      }),
    });

    this.addCommand({
      id: ReviewCommands.ANCHORED_COMMENT_ID,
      name: ReviewCommands.ANCHORED_COMMENT_NAME,
      editorCallback: runEditor(async (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new Notice(ReviewNotices.SELECT_TEXT_FIRST);
          return;
        }

        this.replaceSelectionWithoutTrackChanges(
          editor,
          this.markupBuilder.createAnchoredCommentMarkup(selection, this.settings.authorName)
        );
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      }),
    });

    this.addCommand({
      id: ReviewCommands.MARK_ADDITION_ID,
      name: ReviewCommands.MARK_ADDITION_NAME,
      editorCallback: runEditor(async (editor) => {
        this.wrapSelection(
          editor,
          editor.getSelection(),
          ReviewMarkupSyntax.ADDITION_PREFIX,
          ReviewMarkupSyntax.ADDITION_SUFFIX
        );
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      }),
    });

    this.addCommand({
      id: ReviewCommands.MARK_DELETION_ID,
      name: ReviewCommands.MARK_DELETION_NAME,
      editorCallback: runEditor(async (editor) => {
        this.wrapSelection(
          editor,
          editor.getSelection(),
          ReviewMarkupSyntax.DELETION_PREFIX,
          ReviewMarkupSyntax.DELETION_SUFFIX
        );
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      }),
    });

    this.addCommand({
      id: ReviewCommands.HIGHLIGHT_SELECTION_ID,
      name: ReviewCommands.HIGHLIGHT_SELECTION_NAME,
      editorCallback: runEditor(async (editor) => {
        this.wrapSelection(
          editor,
          editor.getSelection(),
          ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_PREFIX,
          ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_SUFFIX
        );
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      }),
    });

    this.addCommand({
      id: ReviewCommands.MARK_SUBSTITUTION_ID,
      name: ReviewCommands.MARK_SUBSTITUTION_NAME,
      editorCallback: runEditor(async (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new Notice(ReviewNotices.SELECT_TEXT_FOR_SUBSTITUTION);
          return;
        }

        this.replaceSelectionWithoutTrackChanges(
          editor,
          this.markupBuilder.createSubstitutionMarkup(selection)
        );
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      }),
    });

    this.addCommand({
      id: ReviewCommands.OPEN_COMMENTS_PANE_ID,
      name: ReviewCommands.OPEN_COMMENTS_PANE_NAME,
      callback: runGlobal(async () => {
        await this.activateCommentsPane();
      }),
    });

    this.addCommand({
      id: ReviewCommands.OPEN_CHANGES_PANE_ID,
      name: ReviewCommands.OPEN_CHANGES_PANE_NAME,
      callback: runGlobal(async () => {
        await this.activateChangesPane();
      }),
    });

    this.addCommand({
      id: ReviewCommands.OPEN_QUICK_ACTIONS_PANE_ID,
      name: ReviewCommands.OPEN_QUICK_ACTIONS_PANE_NAME,
      callback: runGlobal(async () => {
        await this.activateChangesPane();
      }),
    });

    this.addCommand({
      id: ReviewCommands.TOGGLE_TRACK_CHANGES_ID,
      name: ReviewCommands.TOGGLE_TRACK_CHANGES_NAME,
      callback: runGlobal(async () => {
        await this.toggleTrackChangesMode();
      }),
    });

    this.addCommand({
      id: ReviewCommands.TOGGLE_ACCEPTED_TEXT_VIEW_ID,
      name: ReviewCommands.TOGGLE_ACCEPTED_TEXT_VIEW_NAME,
      callback: runGlobal(async () => {
        await this.toggleAcceptedTextView();
      }),
    });

    this.addCommand({
      id: ReviewCommands.ACCEPT_ALL_CHANGES_ID,
      name: ReviewCommands.ACCEPT_ALL_CHANGES_NAME,
      editorCallback: runEditor((editor) => {
        this.acceptAllTrackedChanges(editor);
      }),
    });

    this.addCommand({
      id: ReviewCommands.ACCEPT_CHANGE_AT_CURSOR_ID,
      name: ReviewCommands.ACCEPT_CHANGE_AT_CURSOR_NAME,
      editorCallback: runEditor(async (editor) => {
        await this.resolveChangeAtCursor(editor, 'accept');
      }),
    });

    this.addCommand({
      id: ReviewCommands.REJECT_CHANGE_AT_CURSOR_ID,
      name: ReviewCommands.REJECT_CHANGE_AT_CURSOR_NAME,
      editorCallback: runEditor(async (editor) => {
        await this.resolveChangeAtCursor(editor, 'reject');
      }),
    });
  }

  private registerEvents(): void {
    this.registerEvent(
      this.app.workspace.on(ReviewWorkspaceEvents.ACTIVE_LEAF_CHANGE, () => {
        void this.refreshCommentsPane();
        void this.refreshChangesPane();
      })
    );

    this.registerEvent(
      this.app.workspace.on(ReviewWorkspaceEvents.FILE_OPEN, () => {
        void this.refreshCommentsPane();
        void this.refreshChangesPane();
      })
    );

    this.registerEvent(
      this.app.vault.on(ReviewWorkspaceEvents.MODIFY, (file) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile && file.path === activeFile.path) {
          void this.refreshCommentsPane();
          void this.refreshChangesPane();
        }
      })
    );
  }

  private wrapSelection(editor: Editor, selection: string, prefix: string, suffix: string): void {
    if (!selection) {
      new Notice(ReviewNotices.SELECT_TEXT_FIRST);
      return;
    }

    this.replaceSelectionWithoutTrackChanges(
      editor,
      this.markupBuilder.wrapSelectionMarkup(selection, prefix, suffix)
    );
  }

  async activateCommentsPane(): Promise<void> {
    let leaf: WorkspaceLeaf | null =
      this.app.workspace.getLeavesOfType(ReviewCommentsView.VIEW_TYPE)[0] ?? null;

    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) {
        new Notice(ReviewNotices.COULD_NOT_OPEN_COMMENTS_PANE);
        return;
      }

      await leaf.setViewState({ type: ReviewCommentsView.VIEW_TYPE, active: true });
    }

    this.app.workspace.revealLeaf(leaf);
    await this.refreshCommentsPane();
  }

  async activateChangesPane(): Promise<void> {
    let leaf: WorkspaceLeaf | null =
      this.app.workspace.getLeavesOfType(ReviewChangesView.VIEW_TYPE)[0] ?? null;

    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) {
        new Notice(ReviewNotices.COULD_NOT_OPEN_CHANGES_PANE);
        return;
      }

      await leaf.setViewState({ type: ReviewChangesView.VIEW_TYPE, active: true });
    }

    this.app.workspace.revealLeaf(leaf);
    await this.refreshChangesPane();
  }

  async activateQuickActionsPane(): Promise<void> {
    await this.activateChangesPane();
  }

  async refreshCommentsPane(): Promise<void> {
    const leaves = this.app.workspace.getLeavesOfType(ReviewCommentsView.VIEW_TYPE);
    if (leaves.length === 0) {
      return;
    }

    const activeFile = this.app.workspace.getActiveFile();
    const entries = await this.getEntriesForFile(activeFile);

    for (const leaf of leaves) {
      if (leaf.view instanceof ReviewCommentsView) {
        leaf.view.setEntries(entries);
      }
    }
  }

  async refreshChangesPane(): Promise<void> {
    const leaves = this.app.workspace.getLeavesOfType(ReviewChangesView.VIEW_TYPE);
    if (leaves.length === 0) {
      return;
    }

    const activeFile = this.app.workspace.getActiveFile();
    const entries = await this.getTrackedChangeEntriesForFile(activeFile);

    for (const leaf of leaves) {
      if (leaf.view instanceof ReviewChangesView) {
        leaf.view.setEntries(entries);
      }
    }
  }

  private async getEntriesForFile(file: TFile | null): Promise<CommentPaneEntry[]> {
    if (!file || file.extension !== ReviewDocumentKeys.MARKDOWN_EXTENSION) {
      return [];
    }

    const content = await this.app.vault.cachedRead(file);
    return this.parser.buildCommentEntries(content);
  }

  private async getTrackedChangeEntriesForFile(file: TFile | null): Promise<TrackedChangeEntry[]> {
    if (!file || file.extension !== ReviewDocumentKeys.MARKDOWN_EXTENSION) {
      return [];
    }

    const content = await this.app.vault.cachedRead(file);
    return this.parser.buildTrackedChangeEntries(content);
  }

  private async navigateToComment(entry: CommentPaneEntry): Promise<void> {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      return;
    }

    let leaf = this.app.workspace.getMostRecentLeaf();
    if (!leaf || leaf.view.getViewType() !== ReviewViewIds.MARKDOWN) {
      leaf = this.app.workspace.getLeavesOfType(ReviewViewIds.MARKDOWN)[0] ?? null;
    }
    if (!leaf) {
      return;
    }

    await leaf.openFile(file, { active: true });
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor || typeof editor.offsetToPos !== 'function') {
      return;
    }

    const position = editor.offsetToPos(entry.from);
    editor.setCursor(position);
    editor.setSelection(position, position);
  }

  private async resolveCommentEntry(entry: CommentPaneEntry): Promise<void> {
    const editor = this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      new Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
      return;
    }

    const currentContent = editor.getValue();
    const currentEntry = this.findExactCommentEntry(currentContent, entry);
    if (!currentEntry) {
      new Notice('Comment no longer matches current note state. Pane refreshed.');
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      return;
    }

    if (currentEntry.isAnchored) {
      const replacement = currentEntry.highlightedText ?? '';
      if (this.replaceRangeByOffsets(editor, currentEntry.from, currentEntry.to, replacement)) {
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      }
      return;
    }

    if (
      typeof currentEntry.commentFrom === 'number' &&
      typeof currentEntry.commentTo === 'number' &&
      this.replaceRangeByOffsets(editor, currentEntry.commentFrom, currentEntry.commentTo, '')
    ) {
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
    }
  }

  private async navigateToTrackedChange(entry: TrackedChangeEntry): Promise<void> {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      return;
    }

    let leaf = this.app.workspace.getMostRecentLeaf();
    if (!leaf || leaf.view.getViewType() !== ReviewViewIds.MARKDOWN) {
      leaf = this.app.workspace.getLeavesOfType(ReviewViewIds.MARKDOWN)[0] ?? null;
    }
    if (!leaf) {
      return;
    }

    await leaf.openFile(file, { active: true });
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;
    if (!editor || typeof editor.offsetToPos !== 'function') {
      return;
    }

    const position = editor.offsetToPos(entry.from);
    editor.setCursor(position);
    editor.setSelection(position, position);
  }

  private async resolveTrackedChange(
    entry: TrackedChangeEntry,
    action: 'accept' | 'reject'
  ): Promise<void> {
    const editor = this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      new Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
      return;
    }

    const currentContent = editor.getValue();
    const currentEntry = this.findExactTrackedChangeEntry(currentContent, entry);
    if (!currentEntry) {
      new Notice('Change no longer matches current note state. Pane refreshed.');
      await this.refreshChangesPane();
      return;
    }

    const replacement =
      currentEntry.type === 'addition'
        ? action === 'accept'
          ? currentEntry.text || ''
          : ''
        : currentEntry.type === 'deletion'
          ? action === 'accept'
            ? ''
            : currentEntry.text || ''
          : action === 'accept'
            ? currentEntry.newText || ''
            : currentEntry.oldText || '';

    if (this.replaceRangeByOffsets(editor, currentEntry.from, currentEntry.to, replacement)) {
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
    }
  }

  private async resolveChangeAtCursor(editor: Editor, action: 'accept' | 'reject'): Promise<void> {
    const cursorOffset = editor.posToOffset(editor.getCursor());
    const entries = this.parser.buildTrackedChangeEntries(editor.getValue());
    const target = entries.find((entry) => cursorOffset >= entry.from && cursorOffset <= entry.to);
    if (!target) {
      return;
    }

    const replacement =
      target.type === 'addition'
        ? action === 'accept'
          ? target.text || ''
          : ''
        : target.type === 'deletion'
          ? action === 'accept'
            ? ''
            : target.text || ''
          : action === 'accept'
            ? target.newText || ''
            : target.oldText || '';

    if (this.replaceRangeByOffsets(editor, target.from, target.to, replacement)) {
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
    }
  }

  private acceptAllTrackedChanges(editorOverride?: Editor): void {
    const editor = editorOverride ?? this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      new Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
      return;
    }

    const content = editor.getValue();
    const resolved = this.changeResolutionService.resolveAllTrackedChangesAsAccepted(content);
    if (resolved !== content) {
      this.trackChangesService.suppressNextTransaction();
      editor.setValue(resolved);
      void this.refreshCommentsPane();
      void this.refreshChangesPane();
    }
  }

  private async applyQuickAction(action: QuickActionType): Promise<boolean> {
    const editor = this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      return false;
    }

    const selection = editor.getSelection();
    if (action === 'add' && !selection) {
      const before = editor.getCursor();
      const startOffset = editor.posToOffset(before);
      this.replaceSelectionWithoutTrackChanges(editor, '{++ ++}');
      editor.setCursor(editor.offsetToPos(startOffset + 4));
      await this.refreshCommentsPane();
      await this.refreshChangesPane();
      return true;
    }

    if (action === 'comment' && !selection) {
      this.replaceSelectionWithoutTrackChanges(
        editor,
        this.markupBuilder.createCommentMarkup(this.settings.authorName)
      );
      await this.refreshCommentsPane();
      await this.refreshChangesPane();
      return true;
    }

    if (!selection) {
      return true;
    }

    if (action !== 'comment') {
      const bounds = this.editorContextService.getEditorSelectionBounds(editor);
      if (
        bounds &&
        this.trackChangesService.isSelectionSyntaxSensitive(
          editor.getValue(),
          bounds.from,
          bounds.to
        )
      ) {
        new Notice(ReviewNotices.QUICK_ACTION_PROTECTED_SELECTION);
        return true;
      }
    }

    switch (action) {
      case 'add':
        this.replaceSelectionWithoutTrackChanges(editor, `{++${selection}++}`);
        break;
      case 'delete':
        this.replaceSelectionWithoutTrackChanges(editor, `{--${selection}--}`);
        break;
      case 'highlight':
        this.replaceSelectionWithoutTrackChanges(editor, `{==${selection}==}`);
        break;
      case 'replace':
        this.replaceSelectionWithoutTrackChanges(editor, `{~~${selection}~>~~}`);
        break;
      case 'comment':
        this.replaceSelectionWithoutTrackChanges(
          editor,
          this.markupBuilder.createAnchoredCommentMarkup(selection, this.settings.authorName)
        );
        break;
    }

    await this.refreshCommentsPane();
    await this.refreshChangesPane();
    return true;
  }

  private async toggleTrackChangesMode(): Promise<void> {
    this.settings.trackChangesEnabled = !this.settings.trackChangesEnabled;
    await this.saveSettings();
    this.nudgeActiveEditorSelection();
    new Notice(
      this.settings.trackChangesEnabled
        ? ReviewNotices.TRACK_CHANGES_ENABLED
        : ReviewNotices.TRACK_CHANGES_DISABLED
    );
  }

  private async toggleAcceptedTextView(): Promise<void> {
    this.settings.acceptedTextViewEnabled = !this.settings.acceptedTextViewEnabled;
    await this.saveSettings();
    this.nudgeActiveEditorSelection();
    new Notice(
      this.settings.acceptedTextViewEnabled
        ? ReviewNotices.ACCEPTED_TEXT_VIEW_ENABLED
        : ReviewNotices.ACCEPTED_TEXT_VIEW_DISABLED
    );
  }

  private showBypassNoticeOncePerSession(): void {
    if (this.bypassNoticeShownThisSession) {
      return;
    }
    this.bypassNoticeShownThisSession = true;
    new Notice(ReviewNotices.TRACK_CHANGES_PROTECTED_BYPASS);
  }

  private async runCommandExclusive<T>(
    task: () => Promise<T> | T,
    silentIfBusy = false
  ): Promise<T | null> {
    if (this.commandInFlight) {
      if (!silentIfBusy) {
        new Notice('Another review action is still running.');
      }
      return null;
    }

    this.commandInFlight = true;
    try {
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      return await task();
    } finally {
      this.commandInFlight = false;
      try {
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      } catch (error) {
        console.error('[review-critic] Pane refresh failed after command.', error);
      }
    }
  }

  private replaceSelectionWithoutTrackChanges(editor: Editor, value: string): void {
    this.trackChangesService.suppressNextTransaction();
    editor.replaceSelection(value);
  }

  private nudgeActiveEditorSelection(): void {
    const editor = this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      return;
    }
    const from = editor.getCursor('from');
    const to = editor.getCursor('to');
    editor.setSelection(from, to);
  }

  private findExactTrackedChangeEntry(
    content: string,
    target: TrackedChangeEntry
  ): TrackedChangeEntry | null {
    const entries = this.parser.buildTrackedChangeEntries(content);
    return (
      entries.find(
        (entry) =>
          entry.type === target.type && entry.from === target.from && entry.to === target.to
      ) ?? null
    );
  }

  private findExactCommentEntry(
    content: string,
    target: CommentPaneEntry
  ): CommentPaneEntry | null {
    const entries = this.parser.buildCommentEntries(content);
    return (
      entries.find((entry) => {
        if (entry.from !== target.from || entry.to !== target.to) {
          return false;
        }
        if (Boolean(entry.isAnchored) !== Boolean(target.isAnchored)) {
          return false;
        }
        if (entry.commentFrom !== target.commentFrom || entry.commentTo !== target.commentTo) {
          return false;
        }
        return true;
      }) ?? null
    );
  }

  private replaceRangeByOffsets(editor: Editor, from: number, to: number, value: string): boolean {
    if (
      typeof editor.offsetToPos === 'function' &&
      typeof editor.replaceRange === 'function' &&
      from >= 0 &&
      to >= from
    ) {
      const fromPos = editor.offsetToPos(from);
      const toPos = editor.offsetToPos(to);
      this.trackChangesService.suppressNextTransaction();
      editor.replaceRange(value, fromPos, toPos);
      return true;
    }

    const content = editor.getValue();
    if (from < 0 || to < from || to > content.length) {
      return false;
    }

    const next = `${content.slice(0, from)}${value}${content.slice(to)}`;
    if (next === content) {
      return false;
    }

    this.trackChangesService.suppressNextTransaction();
    editor.setValue(next);
    return true;
  }

  private applyCssVariables(): void {
    const root = document.documentElement;

    root.style.setProperty(ReviewCssVariables.PREVIEW_INSERT, this.settings.previewColors.insert);
    root.style.setProperty(
      ReviewCssVariables.PREVIEW_ADDITION,
      this.settings.previewColors.addition
    );
    root.style.setProperty(
      ReviewCssVariables.PREVIEW_DELETION,
      this.settings.previewColors.deletion
    );
    root.style.setProperty(ReviewCssVariables.PREVIEW_COMMENT, this.settings.previewColors.comment);
    root.style.setProperty(
      ReviewCssVariables.PREVIEW_HIGHLIGHT,
      this.settings.previewColors.highlight
    );

    root.style.setProperty(ReviewCssVariables.EDIT_INSERT, this.settings.editingColors.insert);
    root.style.setProperty(ReviewCssVariables.EDIT_ADDITION, this.settings.editingColors.addition);
    root.style.setProperty(ReviewCssVariables.EDIT_DELETION, this.settings.editingColors.deletion);
    root.style.setProperty(ReviewCssVariables.EDIT_COMMENT, this.settings.editingColors.comment);
    root.style.setProperty(
      ReviewCssVariables.EDIT_HIGHLIGHT,
      this.settings.editingColors.highlight
    );

    root.style.setProperty(
      ReviewCssVariables.PREVIEW_TEXT_INSERT,
      this.settings.previewTextColors.insert
    );
    root.style.setProperty(
      ReviewCssVariables.PREVIEW_TEXT_ADDITION,
      this.settings.previewTextColors.addition
    );
    root.style.setProperty(
      ReviewCssVariables.PREVIEW_TEXT_DELETION,
      this.settings.previewTextColors.deletion
    );
    root.style.setProperty(
      ReviewCssVariables.PREVIEW_TEXT_COMMENT,
      this.settings.previewTextColors.comment
    );
    root.style.setProperty(
      ReviewCssVariables.PREVIEW_TEXT_HIGHLIGHT,
      this.settings.previewTextColors.highlight
    );

    root.style.setProperty(
      ReviewCssVariables.EDIT_TEXT_INSERT,
      this.settings.editingTextColors.insert
    );
    root.style.setProperty(
      ReviewCssVariables.EDIT_TEXT_ADDITION,
      this.settings.editingTextColors.addition
    );
    root.style.setProperty(
      ReviewCssVariables.EDIT_TEXT_DELETION,
      this.settings.editingTextColors.deletion
    );
    root.style.setProperty(
      ReviewCssVariables.EDIT_TEXT_COMMENT,
      this.settings.editingTextColors.comment
    );
    root.style.setProperty(
      ReviewCssVariables.EDIT_TEXT_HIGHLIGHT,
      this.settings.editingTextColors.highlight
    );
  }

  async loadSettings(): Promise<void> {
    const loadedSettings = (await this.loadData()) as Partial<ReviewPluginSettings> | null;
    const defaults = ReviewDefaults.createDefaultSettings();
    const defaultColors = ReviewDefaults.createDefaultColors();
    const defaultTextColors = ReviewDefaults.createDefaultTextColors();
    const defaultPresets = this.themePresetService.getDefaultThemePresets();
    const mergedPresets =
      loadedSettings?.themePresets && loadedSettings.themePresets.length > 0
        ? loadedSettings.themePresets
        : defaultPresets;
    const mergedActivePresetId = loadedSettings?.activeThemePresetId ?? mergedPresets[0]?.id;

    this.settings = {
      ...defaults,
      ...loadedSettings,
      trackChangesEnabled:
        loadedSettings?.trackChangesEnabled === true
          ? true
          : loadedSettings?.trackChangesEnabled === false
            ? false
            : defaults.trackChangesEnabled,
      acceptedTextViewEnabled:
        loadedSettings?.acceptedTextViewEnabled === true
          ? true
          : loadedSettings?.acceptedTextViewEnabled === false
            ? false
            : defaults.acceptedTextViewEnabled,
      themePresets: mergedPresets,
      activeThemePresetId: mergedActivePresetId,
      previewColors: { ...defaultColors, ...(loadedSettings?.previewColors || {}) },
      editingColors: { ...defaultColors, ...(loadedSettings?.editingColors || {}) },
      previewTextColors: { ...defaultTextColors, ...(loadedSettings?.previewTextColors || {}) },
      editingTextColors: { ...defaultTextColors, ...(loadedSettings?.editingTextColors || {}) },
    };

    const active = this.getActiveThemePreset();
    if (active) {
      this.applyThemePresetToActiveColors(active);
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.applyCssVariables();
    await this.refreshCommentsPane();
    await this.refreshChangesPane();
  }

  private getActiveThemePreset(): ThemePreset | undefined {
    if (!this.settings.activeThemePresetId) {
      return undefined;
    }
    return this.settings.themePresets.find(
      (preset) => preset.id === this.settings.activeThemePresetId
    );
  }

  private applyThemePresetToActiveColors(preset: ThemePreset): void {
    this.settings.previewColors = { ...preset.previewColors };
    this.settings.editingColors = { ...preset.editingColors };
    this.settings.previewTextColors = { ...preset.previewTextColors };
    this.settings.editingTextColors = { ...preset.editingTextColors };
  }

  async activateThemePresetById(presetId: string): Promise<void> {
    const target = this.settings.themePresets.find((preset) => preset.id === presetId);
    if (!target) {
      return;
    }

    this.settings.activeThemePresetId = target.id;
    this.applyThemePresetToActiveColors(target);
    await this.saveSettings();
  }

  async saveThemePresetByName(name: string, overwrite: boolean): Promise<void> {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    try {
      const result = this.themePresetService.upsert(
        this.settings.themePresets,
        trimmed,
        {
          previewColors: { ...this.settings.previewColors },
          editingColors: { ...this.settings.editingColors },
          previewTextColors: { ...this.settings.previewTextColors },
          editingTextColors: { ...this.settings.editingTextColors },
        },
        overwrite
      );
      this.settings.themePresets = result.presets;
      this.settings.activeThemePresetId = result.saved.id;
      await this.saveSettings();
      new Notice(result.overwritten ? ReviewNotices.THEME_DUPLICATE : ReviewNotices.THEME_SAVED);
    } catch (error) {
      if (error instanceof Error && error.message === 'duplicate_theme_name') {
        new Notice(ReviewNotices.THEME_DUPLICATE);
        return;
      }
      throw error;
    }
  }

  async deleteThemePresetById(presetId: string): Promise<void> {
    try {
      const updated = this.themePresetService.deletePreset(this.settings.themePresets, presetId);
      this.settings.themePresets = updated;

      if (!updated.find((preset) => preset.id === this.settings.activeThemePresetId)) {
        this.settings.activeThemePresetId = updated[0]?.id;
      }

      const active = this.getActiveThemePreset();
      if (active) {
        this.applyThemePresetToActiveColors(active);
      }

      await this.saveSettings();
      new Notice(ReviewNotices.THEME_DELETED);
    } catch (error) {
      if (error instanceof Error && error.message === 'cannot_delete_builtin_theme') {
        new Notice(ReviewNotices.THEME_DELETE_BLOCKED);
        return;
      }
      throw error;
    }
  }
}

class ReviewSettingTab extends PluginSettingTab {
  private readonly plugin: ReviewPlugin;
  private themeNameDraft = '';
  private selectedThemeId = '';

  constructor(app: App, plugin: ReviewPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    this.selectedThemeId = this.plugin.settings.activeThemePresetId || '';

    containerEl.createEl('h2', { text: ReviewSettingsText.TAB_TITLE });
    containerEl.createEl('p', {
      text: ReviewSettingsText.SETTINGS_DESCRIPTION,
      cls: ReviewCssClasses.SETTINGS_PRD_LINK,
    });

    new Setting(containerEl)
      .setName(ReviewSettingsText.AUTHOR_NAME_LABEL)
      .setDesc(ReviewSettingsText.AUTHOR_NAME_DESCRIPTION)
      .addText((textInput) =>
        textInput
          .setPlaceholder(ReviewSettingsText.AUTHOR_NAME_PLACEHOLDER)
          .setValue(this.plugin.settings.authorName)
          .onChange(async (value) => {
            this.plugin.settings.authorName = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl).setName(ReviewSettingsText.ENABLE_READING_LABEL).addToggle((toggle) =>
      toggle.setValue(this.plugin.settings.enableReadingView).onChange(async (value) => {
        this.plugin.settings.enableReadingView = value;
        await this.plugin.saveSettings();
      })
    );

    new Setting(containerEl).setName(ReviewSettingsText.ENABLE_LIVE_LABEL).addToggle((toggle) =>
      toggle.setValue(this.plugin.settings.enableLivePreview).onChange(async (value) => {
        this.plugin.settings.enableLivePreview = value;
        await this.plugin.saveSettings();
      })
    );

    new Setting(containerEl)
      .setName(ReviewSettingsText.ENABLE_TRACK_CHANGES_LABEL)
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.trackChangesEnabled).onChange(async (value) => {
          this.plugin.settings.trackChangesEnabled = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(ReviewSettingsText.ENABLE_ACCEPTED_TEXT_LABEL)
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.acceptedTextViewEnabled).onChange(async (value) => {
          this.plugin.settings.acceptedTextViewEnabled = value;
          await this.plugin.saveSettings();
        })
      );

    this.renderColorSection(
      ReviewSettingsText.PREVIEW_COLORS_TITLE,
      this.plugin.settings.previewColors,
      async () => {
        await this.plugin.saveSettings();
      }
    );

    this.renderColorSection(
      ReviewSettingsText.EDITING_COLORS_TITLE,
      this.plugin.settings.editingColors,
      async () => {
        await this.plugin.saveSettings();
      }
    );

    this.renderColorSection(
      ReviewSettingsText.PREVIEW_TEXT_COLORS_TITLE,
      this.plugin.settings.previewTextColors,
      async () => {
        await this.plugin.saveSettings();
      }
    );

    this.renderColorSection(
      ReviewSettingsText.EDITING_TEXT_COLORS_TITLE,
      this.plugin.settings.editingTextColors,
      async () => {
        await this.plugin.saveSettings();
      }
    );

    this.renderThemePresetSection();
  }

  private renderColorSection(
    title: string,
    target: ReviewColorSettings,
    onSave: () => Promise<void>
  ): void {
    const section = this.containerEl.createDiv({ cls: ReviewCssClasses.COLOR_SECTION });
    section.createEl('h3', { text: title });

    this.addColorTextSetting(
      section,
      ReviewSettingsText.COLOR_INSERT_LABEL,
      target.insert,
      async (value) => {
        target.insert = value;
        await onSave();
      }
    );

    this.addColorTextSetting(
      section,
      ReviewSettingsText.COLOR_ADDITION_LABEL,
      target.addition,
      async (value) => {
        target.addition = value;
        await onSave();
      }
    );

    this.addColorTextSetting(
      section,
      ReviewSettingsText.COLOR_DELETION_LABEL,
      target.deletion,
      async (value) => {
        target.deletion = value;
        await onSave();
      }
    );

    this.addColorTextSetting(
      section,
      ReviewSettingsText.COLOR_COMMENT_LABEL,
      target.comment,
      async (value) => {
        target.comment = value;
        await onSave();
      }
    );

    this.addColorTextSetting(
      section,
      ReviewSettingsText.COLOR_HIGHLIGHT_LABEL,
      target.highlight,
      async (value) => {
        target.highlight = value;
        await onSave();
      }
    );
  }

  private addColorTextSetting(
    container: HTMLElement,
    label: string,
    value: string,
    onChange: (value: string) => Promise<void>
  ): void {
    new Setting(container)
      .setName(label)
      .setDesc(ReviewSettingsText.COLOR_DESCRIPTION)
      .addText((textInput) =>
        textInput.setValue(value).onChange(async (nextValue) => {
          const normalized = nextValue.trim();
          if (normalized.length === 0) {
            return;
          }

          await onChange(normalized);
        })
      );
  }

  private renderThemePresetSection(): void {
    const section = this.containerEl.createDiv({ cls: ReviewCssClasses.COLOR_SECTION });
    section.createEl('h3', { text: ReviewSettingsText.THEMES_TITLE });

    new Setting(section).setName(ReviewSettingsText.THEME_ACTIVE_LABEL).addDropdown((dropdown) => {
      this.plugin.settings.themePresets.forEach((preset) => {
        dropdown.addOption(preset.id, preset.name);
      });
      dropdown.setValue(this.plugin.settings.activeThemePresetId || '').onChange(async (value) => {
        this.selectedThemeId = value;
        await this.plugin.activateThemePresetById(value);
        this.display();
      });
    });

    new Setting(section)
      .setName(ReviewSettingsText.THEME_SAVE_NAME_LABEL)
      .addText((textInput) =>
        textInput
          .setPlaceholder('Theme name')
          .setValue(this.themeNameDraft)
          .onChange((value) => {
            this.themeNameDraft = value;
          })
      )
      .addButton((button) =>
        button.setButtonText(ReviewSettingsText.THEME_SAVE_BUTTON_LABEL).onClick(async () => {
          await this.plugin.saveThemePresetByName(this.themeNameDraft, true);
          this.display();
        })
      );

    new Setting(section)
      .setName(ReviewSettingsText.THEME_DELETE_LABEL)
      .addDropdown((dropdown) => {
        this.plugin.settings.themePresets.forEach((preset) => {
          dropdown.addOption(preset.id, preset.name);
        });
        dropdown
          .setValue(this.selectedThemeId || this.plugin.settings.activeThemePresetId || '')
          .onChange((value) => {
            this.selectedThemeId = value;
          });
      })
      .addButton((button) =>
        button.setButtonText(ReviewSettingsText.THEME_DELETE_BUTTON_LABEL).onClick(async () => {
          const targetId = this.selectedThemeId || this.plugin.settings.activeThemePresetId;
          if (!targetId) {
            return;
          }
          await this.plugin.deleteThemePresetById(targetId);
          this.display();
        })
      );
  }
}
