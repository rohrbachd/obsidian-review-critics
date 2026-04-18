import {
  type App,
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  type TFile,
  type WorkspaceLeaf,
} from 'obsidian';
import { ReviewCommentsView } from './comments-view';
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
import { ReviewMarkupBuilder } from './review-commands';
import { ReviewParser } from './review-parser';
import { ReviewReadingViewDecorator } from './reading-view';
import type { CommentPaneEntry, ReviewColorSettings, ReviewPluginSettings } from './review-types';

export default class ReviewPlugin extends Plugin {
  settings!: ReviewPluginSettings;

  private readonly parser = new ReviewParser();
  private readonly markupBuilder = new ReviewMarkupBuilder();
  private readonly readingViewDecorator = new ReviewReadingViewDecorator(this.parser);
  private readonly livePreviewFactory = new ReviewLivePreviewExtensionFactory(this.parser);

  async onload(): Promise<void> {
    await this.loadSettings();
    this.applyCssVariables();

    this.registerView(
      ReviewCommentsView.VIEW_TYPE,
      (leaf: WorkspaceLeaf) =>
        new ReviewCommentsView(leaf, async (entry) => this.navigateToComment(entry))
    );

    this.registerMarkdownPostProcessor((element, context) => {
      try {
        this.readingViewDecorator.decorate(element, context, this.settings.enableReadingView);
      } catch (error) {
        console.error('[review-critic] Reading view decoration failed.', error);
      }
    });

    this.registerEditorExtension(
      this.livePreviewFactory.createExtension(() => this.settings.enableLivePreview)
    );

    this.addCommands();
    this.registerEvents();
    this.addSettingTab(new ReviewSettingTab(this.app, this));

    await this.refreshCommentsPane();
  }

  onunload(): void {
    this.app.workspace.detachLeavesOfType(ReviewCommentsView.VIEW_TYPE);
  }

  private addCommands(): void {
    this.addCommand({
      id: ReviewCommands.INSERT_COMMENT_ID,
      name: ReviewCommands.INSERT_COMMENT_NAME,
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        if (selection) {
          editor.replaceSelection(
            this.markupBuilder.createAnchoredCommentMarkup(selection, this.settings.authorName)
          );
        } else {
          editor.replaceSelection(this.markupBuilder.createCommentMarkup(this.settings.authorName));
        }
        void this.refreshCommentsPane();
      },
    });

    this.addCommand({
      id: ReviewCommands.ANCHORED_COMMENT_ID,
      name: ReviewCommands.ANCHORED_COMMENT_NAME,
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new Notice(ReviewNotices.SELECT_TEXT_FIRST);
          return;
        }

        editor.replaceSelection(
          this.markupBuilder.createAnchoredCommentMarkup(selection, this.settings.authorName)
        );
        void this.refreshCommentsPane();
      },
    });

    this.addCommand({
      id: ReviewCommands.MARK_ADDITION_ID,
      name: ReviewCommands.MARK_ADDITION_NAME,
      editorCallback: (editor) => {
        this.wrapSelection(
          editor.getSelection(),
          editor.replaceSelection.bind(editor),
          ReviewMarkupSyntax.ADDITION_PREFIX,
          ReviewMarkupSyntax.ADDITION_SUFFIX
        );
        void this.refreshCommentsPane();
      },
    });

    this.addCommand({
      id: ReviewCommands.MARK_DELETION_ID,
      name: ReviewCommands.MARK_DELETION_NAME,
      editorCallback: (editor) => {
        this.wrapSelection(
          editor.getSelection(),
          editor.replaceSelection.bind(editor),
          ReviewMarkupSyntax.DELETION_PREFIX,
          ReviewMarkupSyntax.DELETION_SUFFIX
        );
        void this.refreshCommentsPane();
      },
    });

    this.addCommand({
      id: ReviewCommands.HIGHLIGHT_SELECTION_ID,
      name: ReviewCommands.HIGHLIGHT_SELECTION_NAME,
      editorCallback: (editor) => {
        this.wrapSelection(
          editor.getSelection(),
          editor.replaceSelection.bind(editor),
          ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_PREFIX,
          ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_SUFFIX
        );
        void this.refreshCommentsPane();
      },
    });

    this.addCommand({
      id: ReviewCommands.MARK_SUBSTITUTION_ID,
      name: ReviewCommands.MARK_SUBSTITUTION_NAME,
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new Notice(ReviewNotices.SELECT_TEXT_FOR_SUBSTITUTION);
          return;
        }

        editor.replaceSelection(this.markupBuilder.createSubstitutionMarkup(selection));
        void this.refreshCommentsPane();
      },
    });

    this.addCommand({
      id: ReviewCommands.OPEN_COMMENTS_PANE_ID,
      name: ReviewCommands.OPEN_COMMENTS_PANE_NAME,
      callback: async () => {
        await this.activateCommentsPane();
      },
    });
  }

  private registerEvents(): void {
    this.registerEvent(
      this.app.workspace.on(ReviewWorkspaceEvents.ACTIVE_LEAF_CHANGE, () => {
        void this.refreshCommentsPane();
      })
    );

    this.registerEvent(
      this.app.workspace.on(ReviewWorkspaceEvents.FILE_OPEN, () => {
        void this.refreshCommentsPane();
      })
    );

    this.registerEvent(
      this.app.vault.on(ReviewWorkspaceEvents.MODIFY, (file) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile && file.path === activeFile.path) {
          void this.refreshCommentsPane();
        }
      })
    );
  }

  private wrapSelection(
    selection: string,
    replaceSelection: (value: string) => void,
    prefix: string,
    suffix: string
  ): void {
    if (!selection) {
      new Notice(ReviewNotices.SELECT_TEXT_FIRST);
      return;
    }

    replaceSelection(this.markupBuilder.wrapSelectionMarkup(selection, prefix, suffix));
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

  private async getEntriesForFile(file: TFile | null): Promise<CommentPaneEntry[]> {
    if (!file || file.extension !== ReviewDocumentKeys.MARKDOWN_EXTENSION) {
      return [];
    }

    const content = await this.app.vault.cachedRead(file);
    return this.parser.buildCommentEntries(content);
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

    this.settings = {
      ...defaults,
      ...loadedSettings,
      previewColors: { ...defaultColors, ...(loadedSettings?.previewColors || {}) },
      editingColors: { ...defaultColors, ...(loadedSettings?.editingColors || {}) },
      previewTextColors: { ...defaultTextColors, ...(loadedSettings?.previewTextColors || {}) },
      editingTextColors: { ...defaultTextColors, ...(loadedSettings?.editingTextColors || {}) },
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.applyCssVariables();
    await this.refreshCommentsPane();
  }
}

class ReviewSettingTab extends PluginSettingTab {
  private readonly plugin: ReviewPlugin;

  constructor(app: App, plugin: ReviewPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

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
}
