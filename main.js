/* Bundled for Obsidian */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ReviewPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/comments-view.ts
var import_obsidian = require("obsidian");

// src/review-config.ts
var ReviewViewIds = class {
};
ReviewViewIds.COMMENTS_PANE = "review-comments-pane";
ReviewViewIds.CHANGES_PANE = "review-changes-pane";
ReviewViewIds.QUICK_ACTIONS_PANE = "review-quick-actions-pane";
ReviewViewIds.MARKDOWN = "markdown";
var ReviewCommands = class {
};
ReviewCommands.INSERT_COMMENT_ID = "insert-review-comment";
ReviewCommands.INSERT_COMMENT_NAME = "Comment";
ReviewCommands.ANCHORED_COMMENT_ID = "add-comment-to-selection";
ReviewCommands.ANCHORED_COMMENT_NAME = "Comment Selection";
ReviewCommands.HIGHLIGHT_SELECTION_ID = "mark-selection-highlight";
ReviewCommands.HIGHLIGHT_SELECTION_NAME = "Highlight";
ReviewCommands.MARK_ADDITION_ID = "mark-selection-addition";
ReviewCommands.MARK_ADDITION_NAME = "Add";
ReviewCommands.MARK_DELETION_ID = "mark-selection-deletion";
ReviewCommands.MARK_DELETION_NAME = "Delete";
ReviewCommands.MARK_SUBSTITUTION_ID = "mark-selection-substitution";
ReviewCommands.MARK_SUBSTITUTION_NAME = "Replace";
ReviewCommands.OPEN_COMMENTS_PANE_ID = "open-review-comments-pane";
ReviewCommands.OPEN_COMMENTS_PANE_NAME = "Comments Pane";
ReviewCommands.OPEN_CHANGES_PANE_ID = "open-review-changes-pane";
ReviewCommands.OPEN_CHANGES_PANE_NAME = "Changes Pane";
ReviewCommands.OPEN_QUICK_ACTIONS_PANE_ID = "open-review-quick-actions-pane";
ReviewCommands.OPEN_QUICK_ACTIONS_PANE_NAME = "Quick Actions Pane";
ReviewCommands.TOGGLE_TRACK_CHANGES_ID = "toggle-track-changes-mode";
ReviewCommands.TOGGLE_TRACK_CHANGES_NAME = "Toggle Track Changes Mode";
ReviewCommands.TOGGLE_ACCEPTED_TEXT_VIEW_ID = "toggle-accepted-text-view";
ReviewCommands.TOGGLE_ACCEPTED_TEXT_VIEW_NAME = "Toggle Accepted Text View";
ReviewCommands.ACCEPT_ALL_CHANGES_ID = "accept-all-tracked-changes";
ReviewCommands.ACCEPT_ALL_CHANGES_NAME = "Accept All Tracked Changes";
ReviewCommands.ACCEPT_CHANGE_AT_CURSOR_ID = "accept-tracked-change-at-cursor";
ReviewCommands.ACCEPT_CHANGE_AT_CURSOR_NAME = "Accept Tracked Change At Cursor";
ReviewCommands.REJECT_CHANGE_AT_CURSOR_ID = "reject-tracked-change-at-cursor";
ReviewCommands.REJECT_CHANGE_AT_CURSOR_NAME = "Reject Tracked Change At Cursor";
var ReviewSettingsText = class {
};
ReviewSettingsText.TAB_TITLE = "Review & CriticMarkup settings";
ReviewSettingsText.SETTINGS_DESCRIPTION = "Configure default author, rendering toggles, and token colors.";
ReviewSettingsText.AUTHOR_NAME_LABEL = "Default Author Name";
ReviewSettingsText.AUTHOR_NAME_PLACEHOLDER = "Your name";
ReviewSettingsText.AUTHOR_NAME_DESCRIPTION = "Used when inserting comments.";
ReviewSettingsText.ENABLE_READING_LABEL = "Enable Reading View Rendering";
ReviewSettingsText.ENABLE_LIVE_LABEL = "Enable Live Preview Decoration";
ReviewSettingsText.ENABLE_TRACK_CHANGES_LABEL = "Enable Track Changes Mode";
ReviewSettingsText.ENABLE_ACCEPTED_TEXT_LABEL = "Enable Accepted Text View";
ReviewSettingsText.PREVIEW_COLORS_TITLE = "Preview Mode Colors";
ReviewSettingsText.EDITING_COLORS_TITLE = "Editing Mode Colors";
ReviewSettingsText.PREVIEW_TEXT_COLORS_TITLE = "Preview Mode Text Colors";
ReviewSettingsText.EDITING_TEXT_COLORS_TITLE = "Editing Mode Text Colors";
ReviewSettingsText.COLOR_INSERT_LABEL = "Insert";
ReviewSettingsText.COLOR_ADDITION_LABEL = "Addition";
ReviewSettingsText.COLOR_DELETION_LABEL = "Deletion";
ReviewSettingsText.COLOR_COMMENT_LABEL = "Comment";
ReviewSettingsText.COLOR_HIGHLIGHT_LABEL = "Highlight";
ReviewSettingsText.COLOR_DESCRIPTION = "Hex color, e.g. #daf7dc";
ReviewSettingsText.THEMES_TITLE = "Theme Presets";
ReviewSettingsText.THEME_ACTIVE_LABEL = "Active Theme";
ReviewSettingsText.THEME_SAVE_NAME_LABEL = "Theme Name";
ReviewSettingsText.THEME_SAVE_BUTTON_LABEL = "Save Theme";
ReviewSettingsText.THEME_DELETE_LABEL = "Delete Theme";
ReviewSettingsText.THEME_DELETE_BUTTON_LABEL = "Delete Selected Theme";
var ReviewNotices = class {
};
ReviewNotices.SELECT_TEXT_FIRST = "Select some text first.";
ReviewNotices.SELECT_TEXT_FOR_SUBSTITUTION = "Select text to mark as substitution.";
ReviewNotices.COULD_NOT_OPEN_COMMENTS_PANE = "Could not open comments pane.";
ReviewNotices.COULD_NOT_OPEN_CHANGES_PANE = "Could not open changes pane.";
ReviewNotices.COULD_NOT_OPEN_QUICK_ACTIONS_PANE = "Could not open quick actions pane.";
ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR = "No active Markdown editor found.";
ReviewNotices.TRACK_CHANGES_ENABLED = "Track Changes Mode enabled.";
ReviewNotices.TRACK_CHANGES_DISABLED = "Track Changes Mode disabled.";
ReviewNotices.ACCEPTED_TEXT_VIEW_ENABLED = "Accepted Text View enabled.";
ReviewNotices.ACCEPTED_TEXT_VIEW_DISABLED = "Accepted Text View disabled.";
ReviewNotices.THEME_SAVED = "Theme preset saved.";
ReviewNotices.THEME_DELETED = "Theme preset deleted.";
ReviewNotices.THEME_DUPLICATE = "Theme name exists. Overwrite enabled for this save.";
ReviewNotices.THEME_DELETE_BLOCKED = "Built-in presets cannot be deleted.";
var ReviewCssClasses = class {
};
ReviewCssClasses.SETTINGS_PRD_LINK = "review-settings-prd-link";
ReviewCssClasses.COLOR_SECTION = "review-color-section";
var ReviewDocumentKeys = class {
};
ReviewDocumentKeys.MARKDOWN_EXTENSION = "md";
var ReviewCommentsPaneText = class {
};
ReviewCommentsPaneText.DISPLAY_TEXT = "Review comments";
ReviewCommentsPaneText.ICON = "message-square";
ReviewCommentsPaneText.TITLE = "Comments in current note";
ReviewCommentsPaneText.EMPTY_STATE = "No comments found in this note.";
ReviewCommentsPaneText.UNKNOWN_AUTHOR = "Unknown author";
ReviewCommentsPaneText.EMPTY_COMMENT = "(empty comment)";
ReviewCommentsPaneText.LINE_PREFIX = "Line ";
ReviewCommentsPaneText.SNIPPET_PREFIX = 'On: "';
ReviewCommentsPaneText.SNIPPET_SUFFIX = '"';
ReviewCommentsPaneText.SECTION_PREFIX = "Section: ";
var ReviewChangesPaneText = class {
};
ReviewChangesPaneText.DISPLAY_TEXT = "Tracked changes";
ReviewChangesPaneText.ICON = "git-compare";
ReviewChangesPaneText.TITLE = "Changes in current note";
ReviewChangesPaneText.EMPTY_STATE = "No tracked changes found in this note.";
var ReviewQuickActionsPaneText = class {
};
ReviewQuickActionsPaneText.DISPLAY_TEXT = "Quick actions";
ReviewQuickActionsPaneText.ICON = "mouse-pointer-click";
ReviewQuickActionsPaneText.TITLE = "Quick actions";
var ReviewWorkspaceEvents = class {
};
ReviewWorkspaceEvents.ACTIVE_LEAF_CHANGE = "active-leaf-change";
ReviewWorkspaceEvents.FILE_OPEN = "file-open";
ReviewWorkspaceEvents.MODIFY = "modify";
var ReviewCssVariables = class {
};
ReviewCssVariables.PREVIEW_INSERT = "--review-preview-insert";
ReviewCssVariables.PREVIEW_ADDITION = "--review-preview-addition";
ReviewCssVariables.PREVIEW_DELETION = "--review-preview-deletion";
ReviewCssVariables.PREVIEW_COMMENT = "--review-preview-comment";
ReviewCssVariables.PREVIEW_HIGHLIGHT = "--review-preview-highlight";
ReviewCssVariables.EDIT_INSERT = "--review-edit-insert";
ReviewCssVariables.EDIT_ADDITION = "--review-edit-addition";
ReviewCssVariables.EDIT_DELETION = "--review-edit-deletion";
ReviewCssVariables.EDIT_COMMENT = "--review-edit-comment";
ReviewCssVariables.EDIT_HIGHLIGHT = "--review-edit-highlight";
ReviewCssVariables.PREVIEW_TEXT_INSERT = "--review-preview-text-insert";
ReviewCssVariables.PREVIEW_TEXT_ADDITION = "--review-preview-text-addition";
ReviewCssVariables.PREVIEW_TEXT_DELETION = "--review-preview-text-deletion";
ReviewCssVariables.PREVIEW_TEXT_COMMENT = "--review-preview-text-comment";
ReviewCssVariables.PREVIEW_TEXT_HIGHLIGHT = "--review-preview-text-highlight";
ReviewCssVariables.EDIT_TEXT_INSERT = "--review-edit-text-insert";
ReviewCssVariables.EDIT_TEXT_ADDITION = "--review-edit-text-addition";
ReviewCssVariables.EDIT_TEXT_DELETION = "--review-edit-text-deletion";
ReviewCssVariables.EDIT_TEXT_COMMENT = "--review-edit-text-comment";
ReviewCssVariables.EDIT_TEXT_HIGHLIGHT = "--review-edit-text-highlight";
var _ReviewDefaults = class _ReviewDefaults {
  static createDefaultColors() {
    return {
      insert: "#daf7dc",
      addition: "#daf7dc",
      deletion: "#ffd4d4",
      comment: "#d8e9ff",
      highlight: "#fff1a8"
    };
  }
  static createDefaultTextColors() {
    return {
      insert: "#166534",
      addition: "#166534",
      deletion: "#b42318",
      comment: "#1e3a8a",
      highlight: "#1f2937"
    };
  }
  static createDefaultSettings() {
    const colors = _ReviewDefaults.createDefaultColors();
    const textColors = _ReviewDefaults.createDefaultTextColors();
    const presets = _ReviewDefaults.createDefaultThemePresets();
    return {
      authorName: _ReviewDefaults.AUTHOR_NAME,
      enableReadingView: true,
      enableLivePreview: true,
      trackChangesEnabled: false,
      acceptedTextViewEnabled: false,
      themePresets: presets,
      activeThemePresetId: _ReviewDefaults.DEFAULT_THEME_PRESET_ID,
      previewColors: { ...colors },
      editingColors: { ...colors },
      previewTextColors: { ...textColors },
      editingTextColors: { ...textColors }
    };
  }
  static createDefaultThemePresets() {
    return [
      {
        id: _ReviewDefaults.DEFAULT_THEME_PRESET_ID,
        name: _ReviewDefaults.DEFAULT_THEME_PRESET_NAME,
        isBuiltIn: true,
        previewColors: _ReviewDefaults.createDefaultColors(),
        editingColors: _ReviewDefaults.createDefaultColors(),
        previewTextColors: _ReviewDefaults.createDefaultTextColors(),
        editingTextColors: _ReviewDefaults.createDefaultTextColors()
      }
    ];
  }
};
_ReviewDefaults.AUTHOR_NAME = "Daniel Rohrbach";
_ReviewDefaults.DEFAULT_THEME_PRESET_ID = "default";
_ReviewDefaults.DEFAULT_THEME_PRESET_NAME = "Default";
var ReviewDefaults = _ReviewDefaults;
var ReviewParserDefaults = class {
};
ReviewParserDefaults.DOCUMENT_ROOT_HEADING = "Document root";
ReviewParserDefaults.LINE_BREAK = "\n";
ReviewParserDefaults.COMMENT_ENTRY_ID_SEPARATOR = ":";
ReviewParserDefaults.FIRST_LINE_NUMBER = 1;
var ReviewReadingViewText = class {
};
ReviewReadingViewText.SUBSTITUTION_ARROW = " -> ";
ReviewReadingViewText.AUTHOR_SEPARATOR = ": ";
ReviewReadingViewText.EMPTY_TEXT = "";
ReviewReadingViewText.COMMENT_BADGE = "\u{1F4AC}";
ReviewReadingViewText.EMPTY_COMMENT_TEXT = "(empty comment)";
var ReviewMarkupSyntax = class {
};
ReviewMarkupSyntax.COMMENT_PREFIX = "{>>";
ReviewMarkupSyntax.COMMENT_SUFFIX = "<<}";
ReviewMarkupSyntax.AUTHOR_PREFIX = "[author=";
ReviewMarkupSyntax.AUTHOR_SUFFIX = "]";
ReviewMarkupSyntax.COMMENT_PADDING = "  ";
ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_PREFIX = "{==";
ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_SUFFIX = "==}";
ReviewMarkupSyntax.ADDITION_PREFIX = "{++";
ReviewMarkupSyntax.ADDITION_SUFFIX = "++}";
ReviewMarkupSyntax.DELETION_PREFIX = "{--";
ReviewMarkupSyntax.DELETION_SUFFIX = "--}";
ReviewMarkupSyntax.SUBSTITUTION_PREFIX = "{~~";
ReviewMarkupSyntax.SUBSTITUTION_MIDDLE = "~>";
ReviewMarkupSyntax.SUBSTITUTION_SUFFIX = "~~}";
var ReviewRegexPatterns = class {
};
ReviewRegexPatterns.ADDITION = /(?:\{\+\+|‹\+\+)([\s\S]+?)(?:\+\+\}|\+\+›)/g;
ReviewRegexPatterns.DELETION = /(?:\{--|‹--)([\s\S]+?)(?:--\}|--›)/g;
ReviewRegexPatterns.SUBSTITUTION = /(?:\{~~|‹~~)([\s\S]+?)~>([\s\S]*?)(?:~~\}|~~›)/g;
ReviewRegexPatterns.HIGHLIGHT = /(?:\{==|‹==)([\s\S]+?)(?:==\}|==›)/g;
ReviewRegexPatterns.COMMENT = /(?:\{>>|‹>>)\s*(?:\[author=([^\]]+)\]\s*)?([\s\S]*?)\s*(?:<<\}|<<›)/g;
ReviewRegexPatterns.HEADING = /^(#{1,6})\s+(.+)$/;
ReviewRegexPatterns.FENCE = /^\s*(```+|~~~+)/;
ReviewRegexPatterns.ANCHORED_WHITESPACE = /^\s*$/;
ReviewRegexPatterns.INLINE_TOKEN = /(?:\{\+\+|‹\+\+)[\s\S]+?(?:\+\+\}|\+\+›)|(?:\{--|‹--)[\s\S]+?(?:--\}|--›)|(?:\{~~|‹~~)[\s\S]+?~>[\s\S]*?(?:~~\}|~~›)|(?:\{==|‹==)[\s\S]+?(?:==\}|==›)|(?:\{>>|‹>>)\s*(?:\[author=[^\]]+\]\s*)?[\s\S]*?\s*(?:<<\}|<<›)/;

// src/comments-view.ts
var _ReviewCommentsView = class _ReviewCommentsView extends import_obsidian.ItemView {
  constructor(leaf, onNavigate, onResolve, isBusy) {
    super(leaf);
    this.entries = [];
    this.pendingEntryIds = /* @__PURE__ */ new Set();
    this.localBusy = false;
    this.onNavigate = onNavigate;
    this.onResolve = onResolve;
    this.isBusy = isBusy;
  }
  getViewType() {
    return _ReviewCommentsView.VIEW_TYPE;
  }
  getDisplayText() {
    return ReviewCommentsPaneText.DISPLAY_TEXT;
  }
  getIcon() {
    return ReviewCommentsPaneText.ICON;
  }
  async onOpen() {
    this.render();
  }
  async onClose() {
    this.contentEl.empty();
  }
  setEntries(entries) {
    this.entries = entries;
    this.render();
  }
  render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("review-comments-pane");
    root.createEl("h3", { text: ReviewCommentsPaneText.TITLE });
    if (this.entries.length === 0) {
      root.createEl("p", {
        cls: "review-comments-empty",
        text: ReviewCommentsPaneText.EMPTY_STATE
      });
      return;
    }
    const list = root.createEl("div", { cls: "review-comments-list" });
    this.entries.forEach((entry) => {
      const item = list.createEl("button", {
        cls: "review-comments-item",
        attr: { type: "button" }
      });
      item.disabled = this.isUiBusy();
      const heading = item.createEl("div", { cls: "review-comments-item-heading" });
      heading.createSpan({
        text: `${entry.author || ReviewCommentsPaneText.UNKNOWN_AUTHOR} \u2022 ${ReviewCommentsPaneText.LINE_PREFIX}${entry.line}`
      });
      item.createEl("div", {
        cls: "review-comments-item-body",
        text: `Comment: ${entry.commentText || ReviewCommentsPaneText.EMPTY_COMMENT}`
      });
      if (entry.highlightedText) {
        item.createEl("div", {
          cls: "review-comments-item-snippet",
          text: `${ReviewCommentsPaneText.SNIPPET_PREFIX}${entry.highlightedText}${ReviewCommentsPaneText.SNIPPET_SUFFIX}`
        });
      }
      item.createEl("div", {
        cls: "review-comments-item-context",
        text: `${ReviewCommentsPaneText.SECTION_PREFIX}${entry.heading}`
      });
      item.addEventListener("click", () => {
        void this.onNavigate(entry);
      });
      if (entry.canResolve) {
        const actions = item.createEl("div", { cls: "review-comments-item-actions" });
        const resolveButton = actions.createEl("button", {
          cls: "review-comments-resolve-button",
          attr: { type: "button" },
          text: this.pendingEntryIds.has(entry.id) ? "Working..." : "Resolve"
        });
        resolveButton.disabled = this.pendingEntryIds.has(entry.id) || this.isUiBusy();
        resolveButton.addEventListener("click", (event) => {
          event.stopPropagation();
          void this.handleResolve(entry);
        });
      }
    });
  }
  async handleResolve(entry) {
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
  isUiBusy() {
    return this.localBusy || this.isBusy();
  }
};
_ReviewCommentsView.VIEW_TYPE = ReviewViewIds.COMMENTS_PANE;
var ReviewCommentsView = _ReviewCommentsView;

// src/change-resolution.ts
var ChangeResolutionService = class {
  constructor(regexSet) {
    this.regexSet = {
      addition: regexSet?.addition ?? /\{\+\+([\s\S]*?)\+\+\}/g,
      deletion: regexSet?.deletion ?? /\{--([\s\S]*?)--\}/g,
      substitution: regexSet?.substitution ?? /\{~~([\s\S]*?)~>([\s\S]*?)~~\}/g
    };
  }
  resolveAllTrackedChangesAsAccepted(content) {
    return content.replace(this.regexSet.addition, "$1").replace(this.regexSet.deletion, "").replace(this.regexSet.substitution, "$2");
  }
  rejectTrackedChangeByMarkup(content, markup) {
    if (!markup) {
      return content;
    }
    const escaped = this.escapeRegExp(markup);
    const scoped = new RegExp(escaped);
    if (!scoped.test(content)) {
      return content;
    }
    const match = content.match(scoped)?.[0];
    if (!match) {
      return content;
    }
    const additionPattern = new RegExp(
      `\\${ReviewMarkupSyntax.ADDITION_PREFIX}([\\s\\S]*?)\\${ReviewMarkupSyntax.ADDITION_SUFFIX}`
    );
    const deletionPattern = new RegExp(
      `\\${ReviewMarkupSyntax.DELETION_PREFIX}([\\s\\S]*?)\\${ReviewMarkupSyntax.DELETION_SUFFIX}`
    );
    const substitutionPattern = new RegExp(
      `\\${ReviewMarkupSyntax.SUBSTITUTION_PREFIX}([\\s\\S]*?)\\${ReviewMarkupSyntax.SUBSTITUTION_MIDDLE}([\\s\\S]*?)\\${ReviewMarkupSyntax.SUBSTITUTION_SUFFIX}`
    );
    if (additionPattern.test(match)) {
      return content.replace(match, "");
    }
    if (deletionPattern.test(match)) {
      return content.replace(match, "$1");
    }
    if (substitutionPattern.test(match)) {
      return content.replace(match, "$1");
    }
    return content;
  }
  resolveTrackedChange(content, entry, action) {
    const before = content.slice(0, entry.from);
    const after = content.slice(entry.to);
    let resolved = "";
    if (entry.type === "addition") {
      resolved = action === "accept" ? entry.text || "" : "";
    } else if (entry.type === "deletion") {
      resolved = action === "accept" ? "" : entry.text || "";
    } else {
      resolved = action === "accept" ? entry.newText || "" : entry.oldText || "";
    }
    return `${before}${resolved}${after}`;
  }
  resolveCommentEntry(content, entry) {
    if (typeof entry.commentFrom !== "number" || typeof entry.commentTo !== "number") {
      return content;
    }
    if (entry.commentFrom < 0 || entry.commentTo < entry.commentFrom || entry.commentTo > content.length) {
      return content;
    }
    if (entry.isAnchored) {
      const before = content.slice(0, entry.from);
      const after = content.slice(entry.to);
      const preserved = entry.highlightedText ?? "";
      return `${before}${preserved}${after}`;
    }
    return `${content.slice(0, entry.commentFrom)}${content.slice(entry.commentTo)}`;
  }
  escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
};

// src/changes-view.ts
var import_obsidian2 = require("obsidian");
var _ReviewChangesView = class _ReviewChangesView extends import_obsidian2.ItemView {
  constructor(leaf, onNavigate, onAccept, onReject, onAcceptAll, onQuickAction, onToggleTrackChanges, isTrackChangesEnabled, isBusy) {
    super(leaf);
    this.entries = [];
    this.pendingEntryIds = /* @__PURE__ */ new Set();
    this.acceptAllPending = false;
    this.localBusy = false;
    this.onNavigate = onNavigate;
    this.onAccept = onAccept;
    this.onReject = onReject;
    this.onAcceptAll = onAcceptAll;
    this.onQuickAction = onQuickAction;
    this.onToggleTrackChanges = onToggleTrackChanges;
    this.isTrackChangesEnabled = isTrackChangesEnabled;
    this.isBusy = isBusy;
  }
  getViewType() {
    return _ReviewChangesView.VIEW_TYPE;
  }
  getDisplayText() {
    return ReviewChangesPaneText.DISPLAY_TEXT;
  }
  getIcon() {
    return ReviewChangesPaneText.ICON;
  }
  async onOpen() {
    this.render();
  }
  async onClose() {
    this.contentEl.empty();
  }
  setEntries(entries) {
    this.entries = entries;
    this.render();
  }
  render() {
    this.contentEl.empty();
    this.contentEl.createEl("h3", { text: ReviewChangesPaneText.TITLE });
    const toolbar = this.contentEl.createDiv({ cls: "review-changes-toolbar" });
    const actionsRow = toolbar.createDiv({ cls: "review-quick-actions-row" });
    const actions = [
      { id: "add", label: "Add" },
      { id: "delete", label: "Delete" },
      { id: "highlight", label: "Highlight" },
      { id: "replace", label: "Replace" },
      { id: "comment", label: "Comment" }
    ];
    for (const action of actions) {
      const button = actionsRow.createEl("button", { text: action.label, attr: { type: "button" } });
      button.disabled = this.isUiBusy();
      button.addEventListener("click", () => {
        void this.handleQuickAction(action.id);
      });
    }
    const controlsRow = toolbar.createDiv({ cls: "review-changes-controls-row" });
    const trackButton = controlsRow.createEl("button", {
      text: this.isTrackChangesEnabled() ? "Track Changes: On" : "Track Changes: Off",
      attr: { type: "button" },
      cls: "review-track-toggle"
    });
    trackButton.addEventListener("click", () => {
      void this.handleToggleTrackChanges();
    });
    trackButton.disabled = this.isUiBusy();
    const acceptAllButton = controlsRow.createEl("button", {
      text: this.acceptAllPending ? "Working..." : "Accept All",
      attr: { type: "button" },
      cls: "review-changes-accept-all"
    });
    acceptAllButton.disabled = this.acceptAllPending || this.isUiBusy();
    acceptAllButton.addEventListener("click", () => {
      void this.handleAcceptAll();
    });
    this.contentEl.createDiv({ cls: "review-pane-separator" });
    if (this.entries.length === 0) {
      this.contentEl.createEl("p", { text: ReviewChangesPaneText.EMPTY_STATE });
      return;
    }
    const list = this.contentEl.createDiv({ cls: "review-changes-list" });
    for (const entry of this.entries) {
      const button = list.createEl("button", {
        cls: "review-changes-item",
        attr: { type: "button" }
      });
      button.disabled = this.isUiBusy();
      button.createDiv({ text: `${entry.type} - line ${entry.line}` });
      button.createDiv({ text: entry.context });
      button.addEventListener("click", () => {
        void this.onNavigate(entry);
      });
      const actions2 = list.createDiv({ cls: "review-changes-item-actions" });
      const isPending = this.pendingEntryIds.has(entry.id);
      const acceptButton = actions2.createEl("button", {
        text: isPending ? "Working..." : "Accept",
        attr: { type: "button" }
      });
      acceptButton.disabled = isPending || this.isUiBusy();
      acceptButton.addEventListener("click", (event) => {
        event.stopPropagation();
        void this.handleEntryAction(entry, "accept");
      });
      const rejectButton = actions2.createEl("button", { text: "Reject", attr: { type: "button" } });
      rejectButton.disabled = isPending || this.isUiBusy();
      rejectButton.addEventListener("click", (event) => {
        event.stopPropagation();
        void this.handleEntryAction(entry, "reject");
      });
    }
  }
  async handleQuickAction(action) {
    if (this.isUiBusy()) {
      return;
    }
    this.localBusy = true;
    this.render();
    const applied = await this.onQuickAction(action);
    this.localBusy = false;
    this.render();
    if (!applied) {
      new import_obsidian2.Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
    }
  }
  async handleToggleTrackChanges() {
    if (this.isUiBusy()) {
      return;
    }
    this.localBusy = true;
    this.render();
    await this.onToggleTrackChanges();
    this.localBusy = false;
    this.render();
  }
  async handleAcceptAll() {
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
  async handleEntryAction(entry, action) {
    if (this.pendingEntryIds.has(entry.id) || this.isUiBusy()) {
      return;
    }
    this.pendingEntryIds.add(entry.id);
    this.localBusy = true;
    this.render();
    try {
      if (action === "accept") {
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
  isUiBusy() {
    return this.localBusy || this.isBusy();
  }
};
_ReviewChangesView.VIEW_TYPE = ReviewViewIds.CHANGES_PANE;
var ReviewChangesView = _ReviewChangesView;

// src/live-preview.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");

// src/display-mode.ts
var DisplayModeRenderer = class {
  renderAcceptedTextForToken(token) {
    switch (token.type) {
      case "addition":
        return token.text;
      case "deletion":
        return "";
      case "substitution":
        return token.newText;
      case "highlight":
        return token.text;
      case "comment":
        return "";
      case "anchoredComment":
        return token.highlightedText;
    }
  }
};

// src/live-preview.ts
var HiddenDelimiterWidget = class extends import_view.WidgetType {
  toDOM() {
    const element = document.createElement("span");
    element.className = "review-live-hidden-delimiter";
    return element;
  }
};
var CommentBadgeWidget = class extends import_view.WidgetType {
  constructor(tooltipText) {
    super();
    this.tooltipText = tooltipText;
  }
  toDOM() {
    const element = document.createElement("span");
    element.className = "review-comment-badge review-live-comment-badge";
    element.textContent = ReviewReadingViewText.COMMENT_BADGE;
    element.setAttribute("role", "note");
    element.setAttribute("data-review-tooltip", this.tooltipText);
    return element;
  }
};
var SubstitutionWidget = class extends import_view.WidgetType {
  constructor(oldText, newText) {
    super();
    this.oldText = oldText;
    this.newText = newText;
  }
  toDOM() {
    const wrapper = document.createElement("span");
    wrapper.className = "review-live review-live-substitution";
    const oldSpan = document.createElement("span");
    oldSpan.className = "review-live-substitution-old";
    oldSpan.textContent = this.oldText;
    const arrow = document.createElement("span");
    arrow.className = "review-sub-arrow";
    arrow.textContent = ReviewReadingViewText.SUBSTITUTION_ARROW;
    const newSpan = document.createElement("span");
    newSpan.className = "review-live-substitution-new";
    newSpan.textContent = this.newText;
    wrapper.append(oldSpan, arrow, newSpan);
    return wrapper;
  }
};
var PlainTextWidget = class extends import_view.WidgetType {
  constructor(text) {
    super();
    this.text = text;
  }
  toDOM() {
    const element = document.createElement("span");
    element.textContent = this.text;
    return element;
  }
};
var ReviewLivePreviewExtensionFactory = class _ReviewLivePreviewExtensionFactory {
  constructor(parser, displayModeRenderer) {
    this.hiddenDelimiterWidget = new HiddenDelimiterWidget();
    this.parser = parser;
    this.displayModeRenderer = displayModeRenderer ?? new DisplayModeRenderer();
  }
  createExtension(isEnabled, isAcceptedTextViewEnabled) {
    const parser = this.parser;
    const displayModeRenderer = this.displayModeRenderer;
    const hiddenDelimiterWidget = this.hiddenDelimiterWidget;
    const acceptedTextViewEnabled = isAcceptedTextViewEnabled ?? (() => false);
    class LivePreviewDecorations {
      constructor(view) {
        this.decorations = _ReviewLivePreviewExtensionFactory.buildDecorations(
          view,
          parser,
          displayModeRenderer,
          isEnabled,
          acceptedTextViewEnabled,
          hiddenDelimiterWidget
        );
      }
      update(update) {
        if (update.docChanged || update.viewportChanged || update.selectionSet || update.focusChanged) {
          this.decorations = _ReviewLivePreviewExtensionFactory.buildDecorations(
            update.view,
            parser,
            displayModeRenderer,
            isEnabled,
            acceptedTextViewEnabled,
            hiddenDelimiterWidget
          );
        }
      }
    }
    return import_view.ViewPlugin.fromClass(LivePreviewDecorations, {
      decorations: (value) => value.decorations
    });
  }
  static buildDecorations(view, parser, displayModeRenderer, isEnabled, isAcceptedTextViewEnabled, hiddenDelimiterWidget) {
    const builder = new import_state.RangeSetBuilder();
    if (!isEnabled()) {
      return builder.finish();
    }
    let tokens;
    try {
      const text = view.state.doc.toString();
      tokens = parser.parseTokens(text);
    } catch (error) {
      console.error("[review-critic] Live Preview decoration failed.", error);
      return builder.finish();
    }
    const cursorOffset = view.state.selection.main.head;
    const acceptedTextMode = isAcceptedTextViewEnabled();
    for (const token of tokens) {
      if (acceptedTextMode) {
        switch (token.type) {
          case "addition":
            _ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
              builder,
              token.from,
              token.to,
              3,
              3,
              "review-live review-live-addition",
              hiddenDelimiterWidget
            );
            break;
          case "deletion":
            _ReviewLivePreviewExtensionFactory.addHiddenRange(
              builder,
              token.from,
              token.to,
              hiddenDelimiterWidget
            );
            break;
          case "substitution":
            builder.add(
              token.from,
              token.to,
              import_view.Decoration.replace({
                widget: new PlainTextWidget(displayModeRenderer.renderAcceptedTextForToken(token))
              })
            );
            break;
          case "highlight":
            _ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
              builder,
              token.from,
              token.to,
              3,
              3,
              "review-live review-live-highlight",
              hiddenDelimiterWidget
            );
            break;
          case "comment":
            _ReviewLivePreviewExtensionFactory.addCommentBadge(
              builder,
              token.from,
              token.to,
              token.author,
              token.text
            );
            break;
          case "anchoredComment":
            _ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
              builder,
              token.highlightRange.from,
              token.highlightRange.to,
              3,
              3,
              "review-live review-live-highlight review-live-anchored",
              hiddenDelimiterWidget
            );
            _ReviewLivePreviewExtensionFactory.addCommentBadge(
              builder,
              token.commentRange.from,
              token.commentRange.to,
              token.author,
              token.commentText
            );
            break;
        }
        continue;
      }
      const tokenIsActive = cursorOffset >= token.from && cursorOffset <= token.to;
      if (tokenIsActive) {
        switch (token.type) {
          case "addition":
            builder.add(
              token.from,
              token.to,
              import_view.Decoration.mark({
                class: "review-live review-live-active-token review-live-addition"
              })
            );
            break;
          case "deletion":
            builder.add(
              token.from,
              token.to,
              import_view.Decoration.mark({
                class: "review-live review-live-active-token review-live-deletion"
              })
            );
            break;
          case "substitution":
            builder.add(
              token.from,
              token.to,
              import_view.Decoration.mark({
                class: "review-live review-live-active-token review-live-substitution"
              })
            );
            break;
          case "highlight":
            builder.add(
              token.from,
              token.to,
              import_view.Decoration.mark({
                class: "review-live review-live-active-token review-live-highlight"
              })
            );
            break;
          case "comment":
            builder.add(
              token.from,
              token.to,
              import_view.Decoration.mark({
                class: "review-live review-live-active-token review-live-comment"
              })
            );
            break;
          case "anchoredComment":
            builder.add(
              token.highlightRange.from,
              token.highlightRange.to,
              import_view.Decoration.mark({
                class: "review-live review-live-active-token review-live-highlight review-live-anchored"
              })
            );
            builder.add(
              token.commentRange.from,
              token.commentRange.to,
              import_view.Decoration.mark({
                class: "review-live review-live-active-token review-live-comment review-live-anchored"
              })
            );
            break;
        }
        continue;
      }
      switch (token.type) {
        case "addition":
          _ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
            builder,
            token.from,
            token.to,
            3,
            3,
            "review-live review-live-addition",
            hiddenDelimiterWidget
          );
          break;
        case "deletion":
          _ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
            builder,
            token.from,
            token.to,
            3,
            3,
            "review-live review-live-deletion",
            hiddenDelimiterWidget
          );
          break;
        case "substitution":
          builder.add(
            token.from,
            token.to,
            import_view.Decoration.replace({
              widget: new SubstitutionWidget(token.oldText, token.newText)
            })
          );
          break;
        case "highlight":
          _ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
            builder,
            token.from,
            token.to,
            3,
            3,
            "review-live review-live-highlight",
            hiddenDelimiterWidget
          );
          break;
        case "comment":
          _ReviewLivePreviewExtensionFactory.addCommentBadge(
            builder,
            token.from,
            token.to,
            token.author,
            token.text
          );
          break;
        case "anchoredComment":
          _ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
            builder,
            token.highlightRange.from,
            token.highlightRange.to,
            3,
            3,
            "review-live review-live-highlight review-live-anchored",
            hiddenDelimiterWidget
          );
          _ReviewLivePreviewExtensionFactory.addCommentBadge(
            builder,
            token.commentRange.from,
            token.commentRange.to,
            token.author,
            token.commentText
          );
          break;
      }
    }
    return builder.finish();
  }
  static addCriticTokenDecorations(builder, from, to, openDelimiterLength, closeDelimiterLength, contentClassName, hiddenDelimiterWidget) {
    const contentFrom = from + openDelimiterLength;
    const contentTo = to - closeDelimiterLength;
    if (contentTo <= contentFrom) {
      return;
    }
    _ReviewLivePreviewExtensionFactory.addHiddenRange(
      builder,
      from,
      contentFrom,
      hiddenDelimiterWidget
    );
    builder.add(contentFrom, contentTo, import_view.Decoration.mark({ class: contentClassName }));
    _ReviewLivePreviewExtensionFactory.addHiddenRange(builder, contentTo, to, hiddenDelimiterWidget);
  }
  static addCommentBadge(builder, from, to, author, text) {
    if (to <= from) {
      return;
    }
    const tooltipText = _ReviewLivePreviewExtensionFactory.buildCommentTooltip(author, text);
    builder.add(
      from,
      to,
      import_view.Decoration.replace({
        widget: new CommentBadgeWidget(tooltipText)
      })
    );
  }
  static buildCommentTooltip(author, text) {
    const normalizedText = text.trim() || "(empty comment)";
    if (!author) {
      return normalizedText;
    }
    return `${author}: ${normalizedText}`;
  }
  static addHiddenRange(builder, from, to, hiddenDelimiterWidget) {
    if (to <= from) {
      return;
    }
    builder.add(
      from,
      to,
      import_view.Decoration.replace({
        widget: hiddenDelimiterWidget
      })
    );
  }
};

// src/review-commands.ts
var import_obsidian3 = require("obsidian");
var ReviewMarkupBuilder = class {
  createCommentMarkup(authorName) {
    const author = authorName.trim();
    if (!author) {
      return `${ReviewMarkupSyntax.COMMENT_PREFIX}${ReviewMarkupSyntax.COMMENT_PADDING}${ReviewMarkupSyntax.COMMENT_SUFFIX}`;
    }
    return `${ReviewMarkupSyntax.COMMENT_PREFIX} ${ReviewMarkupSyntax.AUTHOR_PREFIX}${author}${ReviewMarkupSyntax.AUTHOR_SUFFIX}${ReviewMarkupSyntax.COMMENT_PADDING}${ReviewMarkupSyntax.COMMENT_SUFFIX}`;
  }
  createAnchoredCommentMarkup(selection, authorName) {
    const highlight = `${ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_PREFIX}${selection}${ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_SUFFIX}`;
    return `${highlight}${this.createCommentMarkup(authorName)}`;
  }
  wrapSelectionMarkup(selection, prefix, suffix) {
    return `${prefix}${selection}${suffix}`;
  }
  createSubstitutionMarkup(selection) {
    return `${ReviewMarkupSyntax.SUBSTITUTION_PREFIX}${selection}${ReviewMarkupSyntax.SUBSTITUTION_MIDDLE}${ReviewMarkupSyntax.SUBSTITUTION_SUFFIX}`;
  }
};
var EditorContextService = class {
  constructor(workspace) {
    this.workspace = workspace;
  }
  getActiveMarkdownEditor() {
    const activeView = this.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
    if (activeView?.editor) {
      return activeView.editor;
    }
    const recentLeaf = this.workspace.getMostRecentLeaf();
    if (recentLeaf?.view instanceof import_obsidian3.MarkdownView && recentLeaf.view.editor) {
      return recentLeaf.view.editor;
    }
    const markdownLeaf = this.workspace.getLeavesOfType("markdown")[0] ?? null;
    if (markdownLeaf?.view instanceof import_obsidian3.MarkdownView && markdownLeaf.view.editor) {
      return markdownLeaf.view.editor;
    }
    return null;
  }
  getEditorSelectionBounds(editor) {
    if (typeof editor.posToOffset !== "function") {
      return null;
    }
    const from = editor.posToOffset(editor.getCursor("from"));
    const to = editor.posToOffset(editor.getCursor("to"));
    return { from: Math.min(from, to), to: Math.max(from, to) };
  }
};

// src/review-constants.ts
var ReviewSyntaxCatalog = class {
  constructor(rules) {
    const tokenPatterns = {
      addition: rules?.tokenPatterns?.addition ?? ReviewRegexPatterns.ADDITION,
      deletion: rules?.tokenPatterns?.deletion ?? ReviewRegexPatterns.DELETION,
      substitution: rules?.tokenPatterns?.substitution ?? ReviewRegexPatterns.SUBSTITUTION,
      highlight: rules?.tokenPatterns?.highlight ?? ReviewRegexPatterns.HIGHLIGHT,
      comment: rules?.tokenPatterns?.comment ?? ReviewRegexPatterns.COMMENT
    };
    this.rules = {
      tokenPatterns,
      headingPattern: rules?.headingPattern ?? ReviewRegexPatterns.HEADING,
      fencePattern: rules?.fencePattern ?? ReviewRegexPatterns.FENCE,
      anchoredWhitespacePattern: rules?.anchoredWhitespacePattern ?? ReviewRegexPatterns.ANCHORED_WHITESPACE,
      inlineTokenPattern: rules?.inlineTokenPattern ?? ReviewRegexPatterns.INLINE_TOKEN
    };
  }
};

// src/review-parser.ts
var ReviewParser = class {
  constructor(syntax) {
    this.syntax = syntax ?? new ReviewSyntaxCatalog();
  }
  parseTokens(content) {
    const candidates = this.collectCandidateTokens(content);
    const normalizedCandidates = this.normalizeOverlaps(candidates);
    const anchoredResult = this.buildAnchoredComments(content, normalizedCandidates);
    const output = this.buildTokenOutput(normalizedCandidates, anchoredResult.consumedIndexes);
    output.push(...anchoredResult.tokens);
    output.sort((a, b) => a.from - b.from || a.to - b.to);
    return output;
  }
  buildCommentEntries(content) {
    const tokens = this.parseTokens(content);
    const lineStarts = this.getLineStarts(content);
    const headings = this.collectHeadings(content);
    const comments = tokens.filter((token) => {
      return token.type === "comment" || token.type === "anchoredComment";
    });
    return comments.map((token, index) => {
      const line = this.getLineNumber(lineStarts, token.from);
      const commentText = token.type === "anchoredComment" ? token.commentText : token.text;
      const highlightedText = token.type === "anchoredComment" ? token.highlightedText : void 0;
      return {
        id: [token.from, token.to, index].join(ReviewParserDefaults.COMMENT_ENTRY_ID_SEPARATOR),
        from: token.from,
        to: token.to,
        line,
        heading: this.getNearestHeading(headings, token.from),
        commentText,
        author: token.author,
        highlightedText,
        isAnchored: token.type === "anchoredComment",
        canResolve: true,
        commentFrom: token.type === "anchoredComment" ? token.commentRange.from : token.from,
        commentTo: token.type === "anchoredComment" ? token.commentRange.to : token.to
      };
    });
  }
  buildTrackedChangeEntries(content) {
    const tokens = this.parseTokens(content);
    const lineStarts = this.getLineStarts(content);
    const headings = this.collectHeadings(content);
    return tokens.filter(
      (token) => token.type === "addition" || token.type === "deletion" || token.type === "substitution"
    ).map((token, index) => {
      const line = this.getLineNumber(lineStarts, token.from);
      const heading = this.getNearestHeading(headings, token.from);
      const context = content.slice(token.from, Math.min(content.length, token.to + 40)).trim();
      if (token.type === "substitution") {
        return {
          id: [token.type, token.from, token.to, index].join(":"),
          type: token.type,
          from: token.from,
          to: token.to,
          line,
          heading,
          context,
          oldText: token.oldText,
          newText: token.newText
        };
      }
      return {
        id: [token.type, token.from, token.to, index].join(":"),
        type: token.type,
        from: token.from,
        to: token.to,
        line,
        heading,
        context,
        text: token.text
      };
    });
  }
  collectCandidateTokens(content) {
    const candidates = [];
    const segments = this.getNonCodeSegments(content);
    const patterns = this.syntax.rules.tokenPatterns;
    for (const segment of segments) {
      this.collectMatches(segment, patterns.addition, (match, offset) => {
        candidates.push({
          type: "addition",
          from: offset,
          to: offset + match[0].length,
          text: match[1]
        });
      });
      this.collectMatches(segment, patterns.deletion, (match, offset) => {
        candidates.push({
          type: "deletion",
          from: offset,
          to: offset + match[0].length,
          text: match[1]
        });
      });
      this.collectMatches(segment, patterns.substitution, (match, offset) => {
        candidates.push({
          type: "substitution",
          from: offset,
          to: offset + match[0].length,
          oldText: match[1],
          newText: match[2]
        });
      });
      this.collectMatches(segment, patterns.highlight, (match, offset) => {
        candidates.push({
          type: "highlight",
          from: offset,
          to: offset + match[0].length,
          text: match[1]
        });
      });
      this.collectMatches(segment, patterns.comment, (match, offset) => {
        candidates.push({
          type: "comment",
          from: offset,
          to: offset + match[0].length,
          author: match[1]?.trim() || void 0,
          text: match[2]?.trim() || ""
        });
      });
    }
    return candidates;
  }
  normalizeOverlaps(candidates) {
    const sorted = [...candidates].sort((a, b) => a.from - b.from || a.to - b.to);
    const normalized = [];
    for (const token of sorted) {
      const previous = normalized[normalized.length - 1];
      if (previous && token.from < previous.to) {
        continue;
      }
      normalized.push(token);
    }
    return normalized;
  }
  buildAnchoredComments(content, normalizedCandidates) {
    const consumedIndexes = /* @__PURE__ */ new Set();
    const anchoredTokens = [];
    for (let index = 0; index < normalizedCandidates.length - 1; index += 1) {
      const current = normalizedCandidates[index];
      const next = normalizedCandidates[index + 1];
      if (current.type !== "highlight" || next.type !== "comment") {
        continue;
      }
      const betweenText = content.slice(current.to, next.from);
      if (!this.syntax.rules.anchoredWhitespacePattern.test(betweenText)) {
        continue;
      }
      consumedIndexes.add(index);
      consumedIndexes.add(index + 1);
      anchoredTokens.push({
        type: "anchoredComment",
        from: current.from,
        to: next.to,
        highlightedText: current.text || "",
        commentText: next.text || "",
        author: next.author,
        highlightRange: { from: current.from, to: current.to },
        commentRange: { from: next.from, to: next.to }
      });
    }
    return { consumedIndexes, tokens: anchoredTokens };
  }
  buildTokenOutput(candidates, consumedIndexes) {
    const output = [];
    candidates.forEach((token, index) => {
      if (consumedIndexes.has(index)) {
        return;
      }
      switch (token.type) {
        case "addition":
        case "deletion":
          output.push({
            type: token.type,
            from: token.from,
            to: token.to,
            text: token.text || ""
          });
          break;
        case "substitution":
          output.push({
            type: "substitution",
            from: token.from,
            to: token.to,
            oldText: token.oldText || "",
            newText: token.newText || ""
          });
          break;
        case "highlight":
          output.push({
            type: "highlight",
            from: token.from,
            to: token.to,
            text: token.text || ""
          });
          break;
        case "comment":
          output.push({
            type: "comment",
            from: token.from,
            to: token.to,
            text: token.text || "",
            author: token.author
          });
          break;
      }
    });
    return output;
  }
  getNonCodeSegments(content) {
    const lines = content.split(ReviewParserDefaults.LINE_BREAK);
    const segments = [];
    const chunk = [];
    let inFence = false;
    let fenceMarker = "";
    let offset = 0;
    let chunkStart = 0;
    const flush = (nextOffset) => {
      if (chunk.length === 0) {
        chunkStart = nextOffset;
        return;
      }
      segments.push({
        start: chunkStart,
        text: chunk.join(ReviewParserDefaults.LINE_BREAK)
      });
      chunk.length = 0;
      chunkStart = nextOffset;
    };
    lines.forEach((line, index) => {
      const isLast = index === lines.length - 1;
      const lineWithBreak = isLast ? line : `${line}${ReviewParserDefaults.LINE_BREAK}`;
      const fenceMatch = line.match(this.syntax.rules.fencePattern);
      if (fenceMatch) {
        const marker = fenceMatch[1][0];
        if (!inFence) {
          flush(offset);
          inFence = true;
          fenceMarker = marker;
        } else if (fenceMarker === marker) {
          inFence = false;
          chunkStart = offset + lineWithBreak.length;
        }
        offset += lineWithBreak.length;
        return;
      }
      if (!inFence) {
        chunk.push(line);
      }
      offset += lineWithBreak.length;
    });
    flush(offset);
    return segments;
  }
  collectMatches(segment, regex, onMatch) {
    regex.lastIndex = 0;
    let match = regex.exec(segment.text);
    while (match) {
      onMatch(match, segment.start + match.index);
      match = regex.exec(segment.text);
    }
  }
  getLineStarts(content) {
    const starts = [0];
    for (let index = 0; index < content.length; index += 1) {
      if (content[index] === ReviewParserDefaults.LINE_BREAK) {
        starts.push(index + 1);
      }
    }
    return starts;
  }
  getLineNumber(lineStarts, offset) {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low <= high) {
      const midpoint = Math.floor((low + high) / 2);
      if (lineStarts[midpoint] <= offset) {
        low = midpoint + 1;
      } else {
        high = midpoint - 1;
      }
    }
    return Math.max(ReviewParserDefaults.FIRST_LINE_NUMBER, high + 1);
  }
  collectHeadings(content) {
    const headings = [];
    const lines = content.split(ReviewParserDefaults.LINE_BREAK);
    let offset = 0;
    lines.forEach((line, index) => {
      const headingMatch = line.match(this.syntax.rules.headingPattern);
      if (headingMatch) {
        headings.push({ from: offset, text: headingMatch[2].trim() });
      }
      offset += line.length;
      if (index < lines.length - 1) {
        offset += ReviewParserDefaults.LINE_BREAK.length;
      }
    });
    return headings;
  }
  getNearestHeading(headings, offset) {
    let currentHeading = ReviewParserDefaults.DOCUMENT_ROOT_HEADING;
    for (const heading of headings) {
      if (heading.from > offset) {
        break;
      }
      currentHeading = heading.text;
    }
    return currentHeading;
  }
};

// src/reading-view.ts
var ReviewReadingViewDecorator = class {
  constructor(parser, syntax, displayModeRenderer) {
    this.parser = parser;
    this.syntax = syntax ?? new ReviewSyntaxCatalog();
    this.displayModeRenderer = displayModeRenderer ?? new DisplayModeRenderer();
  }
  decorate(root, _context, enabled, acceptedTextViewEnabled = false) {
    if (!enabled) {
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
      if (currentNode.parentElement && !currentNode.parentElement.closest("code, pre")) {
        textNodes.push(currentNode);
      }
      currentNode = walker.nextNode();
    }
    for (const textNode of textNodes) {
      const sourceText = textNode.nodeValue || ReviewReadingViewText.EMPTY_TEXT;
      if (!sourceText.includes("{") || !this.syntax.rules.inlineTokenPattern.test(sourceText)) {
        continue;
      }
      const renderedFragment = this.renderInlineMarkup(sourceText, acceptedTextViewEnabled);
      if (!renderedFragment) {
        continue;
      }
      textNode.replaceWith(renderedFragment);
    }
  }
  renderInlineMarkup(input, acceptedTextViewEnabled) {
    const tokens = this.parser.parseTokens(input).filter((token) => token.from >= 0 && token.to <= input.length);
    if (tokens.length === 0) {
      return null;
    }
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const token of tokens) {
      if (token.from < cursor) {
        continue;
      }
      if (token.from > cursor) {
        fragment.append(input.slice(cursor, token.from));
      }
      this.appendTokenElement(fragment, token, acceptedTextViewEnabled);
      cursor = token.to;
    }
    if (cursor < input.length) {
      fragment.append(input.slice(cursor));
    }
    return fragment;
  }
  appendTokenElement(fragment, token, acceptedTextViewEnabled) {
    switch (token.type) {
      case "addition": {
        if (acceptedTextViewEnabled) {
          fragment.append(this.displayModeRenderer.renderAcceptedTextForToken(token));
          return;
        }
        const span = document.createElement("span");
        span.className = "review-token review-token-addition";
        span.textContent = token.text;
        span.style.backgroundColor = "var(--review-preview-addition)";
        span.style.color = "var(--review-preview-text-addition)";
        fragment.append(span);
        return;
      }
      case "deletion": {
        if (acceptedTextViewEnabled) {
          return;
        }
        const span = document.createElement("span");
        span.className = "review-token review-token-deletion";
        span.textContent = token.text;
        span.style.backgroundColor = "var(--review-preview-deletion)";
        span.style.color = "var(--review-preview-text-deletion)";
        span.style.textDecoration = "line-through";
        fragment.append(span);
        return;
      }
      case "substitution": {
        if (acceptedTextViewEnabled) {
          fragment.append(this.displayModeRenderer.renderAcceptedTextForToken(token));
          return;
        }
        const wrapper = document.createElement("span");
        wrapper.className = "review-token review-token-substitution";
        const oldElement = document.createElement("span");
        oldElement.className = "review-sub-old";
        oldElement.textContent = token.oldText;
        oldElement.style.color = "var(--review-preview-text-deletion)";
        oldElement.style.textDecoration = "line-through";
        const arrowElement = document.createElement("span");
        arrowElement.className = "review-sub-arrow";
        arrowElement.textContent = ReviewReadingViewText.SUBSTITUTION_ARROW;
        const newElement = document.createElement("span");
        newElement.className = "review-sub-new";
        newElement.textContent = token.newText;
        newElement.style.color = "var(--review-preview-text-addition)";
        newElement.style.fontWeight = "600";
        wrapper.append(oldElement, arrowElement, newElement);
        fragment.append(wrapper);
        return;
      }
      case "highlight": {
        const mark = document.createElement("mark");
        mark.className = "review-token review-token-highlight";
        mark.textContent = token.text;
        mark.style.backgroundColor = "var(--review-preview-highlight)";
        mark.style.color = "var(--review-preview-text-highlight)";
        fragment.append(mark);
        return;
      }
      case "comment": {
        const commentBadge = document.createElement("span");
        commentBadge.className = "review-comment-badge";
        commentBadge.textContent = ReviewReadingViewText.COMMENT_BADGE;
        commentBadge.setAttribute("role", "note");
        const tooltip = this.buildCommentTooltip(token.author, token.text);
        commentBadge.setAttribute("data-review-tooltip", tooltip);
        fragment.append(commentBadge);
        return;
      }
      case "anchoredComment": {
        const highlight = document.createElement("mark");
        highlight.className = "review-token review-token-highlight review-token-anchored review-token-has-tooltip";
        highlight.textContent = token.highlightedText;
        const tooltip = this.buildCommentTooltip(token.author, token.commentText);
        highlight.setAttribute("data-review-tooltip", tooltip);
        highlight.style.backgroundColor = "var(--review-preview-highlight)";
        highlight.style.color = "var(--review-preview-text-highlight)";
        fragment.append(highlight);
        return;
      }
    }
  }
  buildCommentTooltip(author, text) {
    const normalizedText = text.trim() || ReviewReadingViewText.EMPTY_COMMENT_TEXT;
    if (!author) {
      return normalizedText;
    }
    return `${author}${ReviewReadingViewText.AUTHOR_SEPARATOR}${normalizedText}`;
  }
};

// src/theme-presets.ts
var TimestampThemeIdGenerator = class {
  createId() {
    return `custom-${Date.now()}`;
  }
};
var ThemePresetService = class {
  constructor(idGenerator) {
    this.idGenerator = idGenerator ?? new TimestampThemeIdGenerator();
  }
  getDefaultThemePresets() {
    return ReviewDefaults.createDefaultThemePresets().map((preset) => ({ ...preset }));
  }
  findByName(presets, name) {
    const normalized = this.normalizeName(name);
    return presets.find((preset) => this.normalizeName(preset.name) === normalized);
  }
  upsert(presets, name, payload, overwrite) {
    const existing = this.findByName(presets, name);
    if (existing && !overwrite) {
      throw new Error("duplicate_theme_name");
    }
    const nextPresets = presets.map((preset) => ({ ...preset }));
    if (existing) {
      const index = nextPresets.findIndex((preset) => preset.id === existing.id);
      const updated = {
        ...existing,
        name: name.trim(),
        ...payload
      };
      nextPresets[index] = updated;
      return { presets: nextPresets, saved: updated, overwritten: true };
    }
    const created = {
      id: this.idGenerator.createId(),
      name: name.trim(),
      isBuiltIn: false,
      ...payload
    };
    nextPresets.push(created);
    return { presets: nextPresets, saved: created, overwritten: false };
  }
  deletePreset(presets, presetId) {
    const target = presets.find((preset) => preset.id === presetId);
    if (!target) {
      return presets;
    }
    if (target.isBuiltIn) {
      throw new Error("cannot_delete_builtin_theme");
    }
    return presets.filter((preset) => preset.id !== presetId);
  }
  normalizeName(value) {
    return value.trim().toLowerCase();
  }
};

// src/track-changes.ts
var import_state2 = require("@codemirror/state");
var TrackChangesService = class {
  constructor() {
    this.skipNextTransaction = false;
  }
  suppressNextTransaction() {
    this.skipNextTransaction = true;
  }
  consumeSuppressedTransaction() {
    if (!this.skipNextTransaction) {
      return false;
    }
    this.skipNextTransaction = false;
    return true;
  }
  applyTrackedEdit(content, from, to, insertedText) {
    if (from < 0 || to < from || to > content.length) {
      return null;
    }
    const selected = content.slice(from, to);
    const insideAddition = this.findTokenContentRange(content, from, "addition");
    const insideSubstitutionNew = this.findSubstitutionNewContentRange(content, from);
    const insideDeletion = this.findTokenContentRange(content, from, "deletion");
    const insideComment = this.findCommentContentRange(content, from);
    if (from === to && insertedText.length > 0) {
      if (this.isInsideTokenDelimiter(content, from)) {
        return { content, cursor: from, preventDefault: true };
      }
      if (insideComment) {
        const next2 = this.insertText(content, from, to, insertedText);
        return { content: next2, cursor: from + insertedText.length };
      }
      if (insideSubstitutionNew) {
        const next2 = this.insertText(content, from, to, insertedText);
        return { content: next2, cursor: from + insertedText.length };
      }
      if (insideAddition) {
        const next2 = this.insertText(content, from, to, insertedText);
        return { content: next2, cursor: from + insertedText.length };
      }
      if (insideDeletion) {
        const left = content.slice(insideDeletion.start, from);
        const right = content.slice(from, insideDeletion.end);
        const replacement = `${this.wrapIfNotEmpty(left, "{--", "--}")}{++${insertedText}++}${this.wrapIfNotEmpty(right, "{--", "--}")}`;
        const next2 = this.insertText(content, insideDeletion.outerStart, insideDeletion.outerEnd, replacement);
        const cursorInsideNewAddition = insideDeletion.outerStart + this.wrapIfNotEmpty(left, "{--", "--}").length + 3 + insertedText.length;
        return { content: next2, cursor: cursorInsideNewAddition };
      }
      let next = this.insertText(content, from, to, `{++${insertedText}++}`);
      next = this.mergeAdjacentTokens(next, "{++", "++}");
      const cursor = next.length;
      return { content: next, cursor: Math.min(cursor, from + insertedText.length + 3) };
    }
    if (from !== to && insertedText.length > 0) {
      const insideCommentFrom = this.findCommentContentRange(content, from);
      const insideCommentTo = this.findCommentContentRange(content, Math.max(from, to - 1));
      if (insideCommentFrom && insideCommentTo && insideCommentFrom.outerStart === insideCommentTo.outerStart && insideCommentFrom.outerEnd === insideCommentTo.outerEnd) {
        const next2 = this.insertText(content, from, to, insertedText);
        return { content: next2, cursor: from + insertedText.length };
      }
      const insideAdditionFrom = this.findTokenContentRange(content, from, "addition");
      const insideAdditionTo = this.findTokenContentRange(content, Math.max(from, to - 1), "addition");
      if (insideAdditionFrom && insideAdditionTo && insideAdditionFrom.outerStart === insideAdditionTo.outerStart && insideAdditionFrom.outerEnd === insideAdditionTo.outerEnd) {
        const next2 = this.insertText(content, from, to, insertedText);
        return { content: next2, cursor: from + insertedText.length };
      }
      if (this.overlapsTokenDelimiters(content, from, to)) {
        return { content, cursor: from, preventDefault: true };
      }
      const replacement = `{~~${selected}~>${insertedText}~~}`;
      const next = this.insertText(content, from, to, replacement);
      const cursor = from + 3 + selected.length + 2 + insertedText.length;
      return { content: next, cursor };
    }
    if (from !== to && insertedText.length === 0) {
      const insideCommentFrom = this.findCommentContentRange(content, from);
      const insideCommentTo = this.findCommentContentRange(content, Math.max(from, to - 1));
      if (insideCommentFrom && insideCommentTo && insideCommentFrom.outerStart === insideCommentTo.outerStart && insideCommentFrom.outerEnd === insideCommentTo.outerEnd) {
        const next2 = this.insertText(content, from, to, "");
        return { content: next2, cursor: from };
      }
      const insideAdditionFrom = this.findTokenContentRange(content, from, "addition");
      const insideAdditionTo = this.findTokenContentRange(content, Math.max(from, to - 1), "addition");
      if (insideAdditionFrom && insideAdditionTo && insideAdditionFrom.outerStart === insideAdditionTo.outerStart && insideAdditionFrom.outerEnd === insideAdditionTo.outerEnd) {
        const next2 = this.insertText(content, from, to, "");
        return { content: next2, cursor: from };
      }
      const insideDeletionFrom = this.findTokenContentRange(content, from, "deletion");
      const insideDeletionTo = this.findTokenContentRange(content, Math.max(from, to - 1), "deletion");
      if (insideDeletionFrom && insideDeletionTo && insideDeletionFrom.outerStart === insideDeletionTo.outerStart && insideDeletionFrom.outerEnd === insideDeletionTo.outerEnd) {
        return { content, cursor: from, preventDefault: true };
      }
      if (this.overlapsTokenDelimiters(content, from, to)) {
        return { content, cursor: from, preventDefault: true };
      }
      let next = this.insertText(content, from, to, `{--${selected}--}`);
      next = this.mergeAdjacentTokens(next, "{--", "--}");
      return { content: next, cursor: from };
    }
    return null;
  }
  findCommentContentRange(content, position) {
    const pattern = /\{>>[\s\S]*?<<\}/g;
    let match = pattern.exec(content);
    while (match) {
      const outerStart = match.index;
      const outerEnd = match.index + match[0].length;
      const outer = match[0];
      const closeIndex = outer.lastIndexOf("<<}");
      if (closeIndex < 0) {
        match = pattern.exec(content);
        continue;
      }
      let contentStartInOuter = 3;
      const authorPrefixMatch = outer.slice(3).match(/^\s*\[author=[^\]]+\]/);
      if (authorPrefixMatch) {
        contentStartInOuter = 3 + authorPrefixMatch[0].length;
      }
      const start = outerStart + contentStartInOuter;
      const end = outerStart + closeIndex;
      if (position >= start && position <= end) {
        return { outerStart, outerEnd, start, end };
      }
      match = pattern.exec(content);
    }
    return null;
  }
  findTokenContentRange(content, position, type) {
    const open = type === "addition" ? "{++" : "{--";
    const close = type === "addition" ? "++}" : "--}";
    const pattern = type === "addition" ? /\{\+\+([\s\S]*?)\+\+\}/g : /\{--([\s\S]*?)--\}/g;
    let match = pattern.exec(content);
    while (match) {
      const outerStart = match.index;
      const outerEnd = match.index + match[0].length;
      const start = outerStart + open.length;
      const end = outerEnd - close.length;
      if (position >= start && position <= end) {
        return { outerStart, outerEnd, start, end };
      }
      match = pattern.exec(content);
    }
    return null;
  }
  findSubstitutionNewContentRange(content, position) {
    const pattern = /\{~~([\s\S]*?)~>([\s\S]*?)~~\}/g;
    let match = pattern.exec(content);
    while (match) {
      const outerStart = match.index;
      const oldTextLength = match[1].length;
      const newTextLength = match[2].length;
      const start = outerStart + 3 + oldTextLength + 2;
      const end = start + newTextLength;
      if (position >= start && position <= end) {
        return { start, end };
      }
      match = pattern.exec(content);
    }
    return null;
  }
  mergeAdjacentTokens(content, open, close) {
    const escapedOpen = open.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedClose = close.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `${escapedOpen}([\\s\\S]*?)${escapedClose}${escapedOpen}([\\s\\S]*?)${escapedClose}`,
      "g"
    );
    let next = content;
    let previous = "";
    while (next !== previous) {
      previous = next;
      next = next.replace(pattern, `${open}$1$2${close}`);
    }
    return next;
  }
  insertText(content, from, to, value) {
    return `${content.slice(0, from)}${value}${content.slice(to)}`;
  }
  wrapIfNotEmpty(value, open, close) {
    return value.length > 0 ? `${open}${value}${close}` : "";
  }
  overlapsTokenDelimiters(content, from, to) {
    const tokenDelimiterPattern = /\{\+\+|\+\+\}|\{--|--\}|\{~~|~>|~~\}|\{>>|<<\}/g;
    let match = tokenDelimiterPattern.exec(content);
    while (match) {
      const delimiterFrom = match.index;
      const delimiterTo = match.index + match[0].length;
      if (from < delimiterTo && to > delimiterFrom) {
        return true;
      }
      match = tokenDelimiterPattern.exec(content);
    }
    return false;
  }
  isInsideTokenDelimiter(content, position) {
    const tokenDelimiterPattern = /\{\+\+|\+\+\}|\{--|--\}|\{~~|~>|~~\}|\{>>|<<\}/g;
    let match = tokenDelimiterPattern.exec(content);
    while (match) {
      const delimiterFrom = match.index;
      const delimiterTo = match.index + match[0].length;
      if (position > delimiterFrom && position < delimiterTo) {
        return true;
      }
      match = tokenDelimiterPattern.exec(content);
    }
    return false;
  }
};
var TrackChangesExtensionFactory = class {
  constructor(trackChangesService) {
    this.trackChangesService = trackChangesService;
  }
  createTransactionFilter(isEnabled) {
    return import_state2.EditorState.transactionFilter.of((transaction) => {
      if (!isEnabled() || !transaction.docChanged) {
        return transaction;
      }
      if (this.trackChangesService.consumeSuppressedTransaction()) {
        return transaction;
      }
      let changeCount = 0;
      let from = 0;
      let to = 0;
      let insertedText = "";
      transaction.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
        changeCount += 1;
        from = fromA;
        to = toA;
        insertedText = inserted.toString();
      });
      if (changeCount !== 1) {
        return transaction;
      }
      const source = transaction.startState.doc.toString();
      const transformed = this.trackChangesService.applyTrackedEdit(source, from, to, insertedText);
      if (transformed?.preventDefault) {
        return {
          changes: { from: 0, to: source.length, insert: source },
          selection: import_state2.EditorSelection.cursor(Math.max(0, transformed.cursor))
        };
      }
      if (!transformed || transformed.content === source) {
        return transaction;
      }
      return {
        changes: { from: 0, to: source.length, insert: transformed.content },
        selection: import_state2.EditorSelection.cursor(Math.max(0, transformed.cursor))
      };
    });
  }
};

// src/main.ts
var ReviewPlugin = class extends import_obsidian4.Plugin {
  constructor() {
    super(...arguments);
    this.commandInFlight = false;
    this.parser = new ReviewParser();
    this.markupBuilder = new ReviewMarkupBuilder();
    this.readingViewDecorator = new ReviewReadingViewDecorator(this.parser);
    this.livePreviewFactory = new ReviewLivePreviewExtensionFactory(this.parser);
    this.trackChangesService = new TrackChangesService();
    this.trackChangesFactory = new TrackChangesExtensionFactory(this.trackChangesService);
    this.editorContextService = new EditorContextService(this.app.workspace);
    this.changeResolutionService = new ChangeResolutionService();
    this.themePresetService = new ThemePresetService();
  }
  async onload() {
    await this.loadSettings();
    this.applyCssVariables();
    this.registerView(
      ReviewCommentsView.VIEW_TYPE,
      (leaf) => new ReviewCommentsView(
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
      (leaf) => new ReviewChangesView(
        leaf,
        async (entry) => this.navigateToTrackedChange(entry),
        async (entry) => {
          await this.runCommandExclusive(async () => {
            await this.resolveTrackedChange(entry, "accept");
          }, true);
        },
        async (entry) => {
          await this.runCommandExclusive(async () => {
            await this.resolveTrackedChange(entry, "reject");
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
        () => this.settings.trackChangesEnabled,
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
        console.error("[review-critic] Reading view decoration failed.", error);
      }
    });
    this.registerEditorExtension(
      this.livePreviewFactory.createExtension(
        () => this.settings.enableLivePreview,
        () => this.settings.acceptedTextViewEnabled
      )
    );
    this.registerEditorExtension(
      this.trackChangesFactory.createTransactionFilter(() => this.settings.trackChangesEnabled)
    );
    this.addCommands();
    this.registerEvents();
    this.addSettingTab(new ReviewSettingTab(this.app, this));
    await this.refreshCommentsPane();
    await this.refreshChangesPane();
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(ReviewCommentsView.VIEW_TYPE);
    this.app.workspace.detachLeavesOfType(ReviewChangesView.VIEW_TYPE);
  }
  addCommands() {
    const runEditor = (handler) => {
      return (editor) => {
        void this.runCommandExclusive(async () => {
          await handler(editor);
        });
      };
    };
    const runGlobal = (handler) => {
      return () => {
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
      })
    });
    this.addCommand({
      id: ReviewCommands.ANCHORED_COMMENT_ID,
      name: ReviewCommands.ANCHORED_COMMENT_NAME,
      editorCallback: runEditor(async (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new import_obsidian4.Notice(ReviewNotices.SELECT_TEXT_FIRST);
          return;
        }
        this.replaceSelectionWithoutTrackChanges(
          editor,
          this.markupBuilder.createAnchoredCommentMarkup(selection, this.settings.authorName)
        );
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      })
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
      })
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
      })
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
      })
    });
    this.addCommand({
      id: ReviewCommands.MARK_SUBSTITUTION_ID,
      name: ReviewCommands.MARK_SUBSTITUTION_NAME,
      editorCallback: runEditor(async (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new import_obsidian4.Notice(ReviewNotices.SELECT_TEXT_FOR_SUBSTITUTION);
          return;
        }
        this.replaceSelectionWithoutTrackChanges(
          editor,
          this.markupBuilder.createSubstitutionMarkup(selection)
        );
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      })
    });
    this.addCommand({
      id: ReviewCommands.OPEN_COMMENTS_PANE_ID,
      name: ReviewCommands.OPEN_COMMENTS_PANE_NAME,
      callback: runGlobal(async () => {
        await this.activateCommentsPane();
      })
    });
    this.addCommand({
      id: ReviewCommands.OPEN_CHANGES_PANE_ID,
      name: ReviewCommands.OPEN_CHANGES_PANE_NAME,
      callback: runGlobal(async () => {
        await this.activateChangesPane();
      })
    });
    this.addCommand({
      id: ReviewCommands.OPEN_QUICK_ACTIONS_PANE_ID,
      name: ReviewCommands.OPEN_QUICK_ACTIONS_PANE_NAME,
      callback: runGlobal(async () => {
        await this.activateChangesPane();
      })
    });
    this.addCommand({
      id: ReviewCommands.TOGGLE_TRACK_CHANGES_ID,
      name: ReviewCommands.TOGGLE_TRACK_CHANGES_NAME,
      callback: runGlobal(async () => {
        await this.toggleTrackChangesMode();
      })
    });
    this.addCommand({
      id: ReviewCommands.TOGGLE_ACCEPTED_TEXT_VIEW_ID,
      name: ReviewCommands.TOGGLE_ACCEPTED_TEXT_VIEW_NAME,
      callback: runGlobal(async () => {
        this.settings.acceptedTextViewEnabled = !this.settings.acceptedTextViewEnabled;
        await this.saveSettings();
        new import_obsidian4.Notice(
          this.settings.acceptedTextViewEnabled ? ReviewNotices.ACCEPTED_TEXT_VIEW_ENABLED : ReviewNotices.ACCEPTED_TEXT_VIEW_DISABLED
        );
      })
    });
    this.addCommand({
      id: ReviewCommands.ACCEPT_ALL_CHANGES_ID,
      name: ReviewCommands.ACCEPT_ALL_CHANGES_NAME,
      editorCallback: runEditor((editor) => {
        this.acceptAllTrackedChanges(editor);
      })
    });
    this.addCommand({
      id: ReviewCommands.ACCEPT_CHANGE_AT_CURSOR_ID,
      name: ReviewCommands.ACCEPT_CHANGE_AT_CURSOR_NAME,
      editorCallback: runEditor(async (editor) => {
        await this.resolveChangeAtCursor(editor, "accept");
      })
    });
    this.addCommand({
      id: ReviewCommands.REJECT_CHANGE_AT_CURSOR_ID,
      name: ReviewCommands.REJECT_CHANGE_AT_CURSOR_NAME,
      editorCallback: runEditor(async (editor) => {
        await this.resolveChangeAtCursor(editor, "reject");
      })
    });
  }
  registerEvents() {
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
  wrapSelection(editor, selection, prefix, suffix) {
    if (!selection) {
      new import_obsidian4.Notice(ReviewNotices.SELECT_TEXT_FIRST);
      return;
    }
    this.replaceSelectionWithoutTrackChanges(
      editor,
      this.markupBuilder.wrapSelectionMarkup(selection, prefix, suffix)
    );
  }
  async activateCommentsPane() {
    let leaf = this.app.workspace.getLeavesOfType(ReviewCommentsView.VIEW_TYPE)[0] ?? null;
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) {
        new import_obsidian4.Notice(ReviewNotices.COULD_NOT_OPEN_COMMENTS_PANE);
        return;
      }
      await leaf.setViewState({ type: ReviewCommentsView.VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
    await this.refreshCommentsPane();
  }
  async activateChangesPane() {
    let leaf = this.app.workspace.getLeavesOfType(ReviewChangesView.VIEW_TYPE)[0] ?? null;
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) {
        new import_obsidian4.Notice(ReviewNotices.COULD_NOT_OPEN_CHANGES_PANE);
        return;
      }
      await leaf.setViewState({ type: ReviewChangesView.VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
    await this.refreshChangesPane();
  }
  async activateQuickActionsPane() {
    await this.activateChangesPane();
  }
  async refreshCommentsPane() {
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
  async refreshChangesPane() {
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
  async getEntriesForFile(file) {
    if (!file || file.extension !== ReviewDocumentKeys.MARKDOWN_EXTENSION) {
      return [];
    }
    const content = await this.app.vault.cachedRead(file);
    return this.parser.buildCommentEntries(content);
  }
  async getTrackedChangeEntriesForFile(file) {
    if (!file || file.extension !== ReviewDocumentKeys.MARKDOWN_EXTENSION) {
      return [];
    }
    const content = await this.app.vault.cachedRead(file);
    return this.parser.buildTrackedChangeEntries(content);
  }
  async navigateToComment(entry) {
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    const editor = view?.editor;
    if (!editor || typeof editor.offsetToPos !== "function") {
      return;
    }
    const position = editor.offsetToPos(entry.from);
    editor.setCursor(position);
    editor.setSelection(position, position);
  }
  async resolveCommentEntry(entry) {
    const editor = this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      new import_obsidian4.Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
      return;
    }
    const currentContent = editor.getValue();
    const currentEntry = this.findExactCommentEntry(currentContent, entry);
    if (!currentEntry) {
      new import_obsidian4.Notice("Comment no longer matches current note state. Pane refreshed.");
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      return;
    }
    if (currentEntry.isAnchored) {
      const replacement = currentEntry.highlightedText ?? "";
      if (this.replaceRangeByOffsets(editor, currentEntry.from, currentEntry.to, replacement)) {
        await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
      }
      return;
    }
    if (typeof currentEntry.commentFrom === "number" && typeof currentEntry.commentTo === "number" && this.replaceRangeByOffsets(editor, currentEntry.commentFrom, currentEntry.commentTo, "")) {
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
    }
  }
  async navigateToTrackedChange(entry) {
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    const editor = view?.editor;
    if (!editor || typeof editor.offsetToPos !== "function") {
      return;
    }
    const position = editor.offsetToPos(entry.from);
    editor.setCursor(position);
    editor.setSelection(position, position);
  }
  async resolveTrackedChange(entry, action) {
    const editor = this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      new import_obsidian4.Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
      return;
    }
    const currentContent = editor.getValue();
    const currentEntry = this.findExactTrackedChangeEntry(currentContent, entry);
    if (!currentEntry) {
      new import_obsidian4.Notice("Change no longer matches current note state. Pane refreshed.");
      await this.refreshChangesPane();
      return;
    }
    const replacement = currentEntry.type === "addition" ? action === "accept" ? currentEntry.text || "" : "" : currentEntry.type === "deletion" ? action === "accept" ? "" : currentEntry.text || "" : action === "accept" ? currentEntry.newText || "" : currentEntry.oldText || "";
    if (this.replaceRangeByOffsets(editor, currentEntry.from, currentEntry.to, replacement)) {
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
    }
  }
  async resolveChangeAtCursor(editor, action) {
    const cursorOffset = editor.posToOffset(editor.getCursor());
    const entries = this.parser.buildTrackedChangeEntries(editor.getValue());
    const target = entries.find((entry) => cursorOffset >= entry.from && cursorOffset <= entry.to);
    if (!target) {
      return;
    }
    const replacement = target.type === "addition" ? action === "accept" ? target.text || "" : "" : target.type === "deletion" ? action === "accept" ? "" : target.text || "" : action === "accept" ? target.newText || "" : target.oldText || "";
    if (this.replaceRangeByOffsets(editor, target.from, target.to, replacement)) {
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
    }
  }
  acceptAllTrackedChanges(editorOverride) {
    const editor = editorOverride ?? this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      new import_obsidian4.Notice(ReviewNotices.NO_ACTIVE_MARKDOWN_EDITOR);
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
  async applyQuickAction(action) {
    const editor = this.editorContextService.getActiveMarkdownEditor();
    if (!editor) {
      return false;
    }
    const selection = editor.getSelection();
    if (action === "add" && !selection) {
      const before = editor.getCursor();
      const startOffset = editor.posToOffset(before);
      this.replaceSelectionWithoutTrackChanges(editor, "{++ ++}");
      editor.setCursor(editor.offsetToPos(startOffset + 4));
      await this.refreshCommentsPane();
      await this.refreshChangesPane();
      return true;
    }
    if (action === "comment" && !selection) {
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
    switch (action) {
      case "add":
        this.replaceSelectionWithoutTrackChanges(editor, `{++${selection}++}`);
        break;
      case "delete":
        this.replaceSelectionWithoutTrackChanges(editor, `{--${selection}--}`);
        break;
      case "highlight":
        this.replaceSelectionWithoutTrackChanges(editor, `{==${selection}==}`);
        break;
      case "replace":
        this.replaceSelectionWithoutTrackChanges(editor, `{~~${selection}~>~~}`);
        break;
      case "comment":
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
  async toggleTrackChangesMode() {
    this.settings.trackChangesEnabled = !this.settings.trackChangesEnabled;
    await this.saveSettings();
    new import_obsidian4.Notice(
      this.settings.trackChangesEnabled ? ReviewNotices.TRACK_CHANGES_ENABLED : ReviewNotices.TRACK_CHANGES_DISABLED
    );
  }
  async runCommandExclusive(task, silentIfBusy = false) {
    if (this.commandInFlight) {
      if (!silentIfBusy) {
        new import_obsidian4.Notice("Another review action is still running.");
      }
      return null;
    }
    this.commandInFlight = true;
    await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
    try {
      return await task();
    } finally {
      this.commandInFlight = false;
      await Promise.all([this.refreshCommentsPane(), this.refreshChangesPane()]);
    }
  }
  replaceSelectionWithoutTrackChanges(editor, value) {
    this.trackChangesService.suppressNextTransaction();
    editor.replaceSelection(value);
  }
  findExactTrackedChangeEntry(content, target) {
    const entries = this.parser.buildTrackedChangeEntries(content);
    return entries.find(
      (entry) => entry.type === target.type && entry.from === target.from && entry.to === target.to
    ) ?? null;
  }
  findExactCommentEntry(content, target) {
    const entries = this.parser.buildCommentEntries(content);
    return entries.find((entry) => {
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
    }) ?? null;
  }
  replaceRangeByOffsets(editor, from, to, value) {
    if (typeof editor.offsetToPos === "function" && typeof editor.replaceRange === "function" && from >= 0 && to >= from) {
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
  applyCssVariables() {
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
  async loadSettings() {
    const loadedSettings = await this.loadData();
    const defaults = ReviewDefaults.createDefaultSettings();
    const defaultColors = ReviewDefaults.createDefaultColors();
    const defaultTextColors = ReviewDefaults.createDefaultTextColors();
    const defaultPresets = this.themePresetService.getDefaultThemePresets();
    const mergedPresets = loadedSettings?.themePresets && loadedSettings.themePresets.length > 0 ? loadedSettings.themePresets : defaultPresets;
    const mergedActivePresetId = loadedSettings?.activeThemePresetId ?? mergedPresets[0]?.id;
    this.settings = {
      ...defaults,
      ...loadedSettings,
      trackChangesEnabled: loadedSettings?.trackChangesEnabled ?? defaults.trackChangesEnabled,
      acceptedTextViewEnabled: loadedSettings?.acceptedTextViewEnabled ?? defaults.acceptedTextViewEnabled,
      themePresets: mergedPresets,
      activeThemePresetId: mergedActivePresetId,
      previewColors: { ...defaultColors, ...loadedSettings?.previewColors || {} },
      editingColors: { ...defaultColors, ...loadedSettings?.editingColors || {} },
      previewTextColors: { ...defaultTextColors, ...loadedSettings?.previewTextColors || {} },
      editingTextColors: { ...defaultTextColors, ...loadedSettings?.editingTextColors || {} }
    };
    const active = this.getActiveThemePreset();
    if (active) {
      this.applyThemePresetToActiveColors(active);
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.applyCssVariables();
    await this.refreshCommentsPane();
    await this.refreshChangesPane();
  }
  getActiveThemePreset() {
    if (!this.settings.activeThemePresetId) {
      return void 0;
    }
    return this.settings.themePresets.find(
      (preset) => preset.id === this.settings.activeThemePresetId
    );
  }
  applyThemePresetToActiveColors(preset) {
    this.settings.previewColors = { ...preset.previewColors };
    this.settings.editingColors = { ...preset.editingColors };
    this.settings.previewTextColors = { ...preset.previewTextColors };
    this.settings.editingTextColors = { ...preset.editingTextColors };
  }
  async activateThemePresetById(presetId) {
    const target = this.settings.themePresets.find((preset) => preset.id === presetId);
    if (!target) {
      return;
    }
    this.settings.activeThemePresetId = target.id;
    this.applyThemePresetToActiveColors(target);
    await this.saveSettings();
  }
  async saveThemePresetByName(name, overwrite) {
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
          editingTextColors: { ...this.settings.editingTextColors }
        },
        overwrite
      );
      this.settings.themePresets = result.presets;
      this.settings.activeThemePresetId = result.saved.id;
      await this.saveSettings();
      new import_obsidian4.Notice(result.overwritten ? ReviewNotices.THEME_DUPLICATE : ReviewNotices.THEME_SAVED);
    } catch (error) {
      if (error instanceof Error && error.message === "duplicate_theme_name") {
        new import_obsidian4.Notice(ReviewNotices.THEME_DUPLICATE);
        return;
      }
      throw error;
    }
  }
  async deleteThemePresetById(presetId) {
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
      new import_obsidian4.Notice(ReviewNotices.THEME_DELETED);
    } catch (error) {
      if (error instanceof Error && error.message === "cannot_delete_builtin_theme") {
        new import_obsidian4.Notice(ReviewNotices.THEME_DELETE_BLOCKED);
        return;
      }
      throw error;
    }
  }
};
var ReviewSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.themeNameDraft = "";
    this.selectedThemeId = "";
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    this.selectedThemeId = this.plugin.settings.activeThemePresetId || "";
    containerEl.createEl("h2", { text: ReviewSettingsText.TAB_TITLE });
    containerEl.createEl("p", {
      text: ReviewSettingsText.SETTINGS_DESCRIPTION,
      cls: ReviewCssClasses.SETTINGS_PRD_LINK
    });
    new import_obsidian4.Setting(containerEl).setName(ReviewSettingsText.AUTHOR_NAME_LABEL).setDesc(ReviewSettingsText.AUTHOR_NAME_DESCRIPTION).addText(
      (textInput) => textInput.setPlaceholder(ReviewSettingsText.AUTHOR_NAME_PLACEHOLDER).setValue(this.plugin.settings.authorName).onChange(async (value) => {
        this.plugin.settings.authorName = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(ReviewSettingsText.ENABLE_READING_LABEL).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableReadingView).onChange(async (value) => {
        this.plugin.settings.enableReadingView = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(ReviewSettingsText.ENABLE_LIVE_LABEL).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableLivePreview).onChange(async (value) => {
        this.plugin.settings.enableLivePreview = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(ReviewSettingsText.ENABLE_TRACK_CHANGES_LABEL).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.trackChangesEnabled).onChange(async (value) => {
        this.plugin.settings.trackChangesEnabled = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(ReviewSettingsText.ENABLE_ACCEPTED_TEXT_LABEL).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.acceptedTextViewEnabled).onChange(async (value) => {
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
  renderColorSection(title, target, onSave) {
    const section = this.containerEl.createDiv({ cls: ReviewCssClasses.COLOR_SECTION });
    section.createEl("h3", { text: title });
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
  addColorTextSetting(container, label, value, onChange) {
    new import_obsidian4.Setting(container).setName(label).setDesc(ReviewSettingsText.COLOR_DESCRIPTION).addText(
      (textInput) => textInput.setValue(value).onChange(async (nextValue) => {
        const normalized = nextValue.trim();
        if (normalized.length === 0) {
          return;
        }
        await onChange(normalized);
      })
    );
  }
  renderThemePresetSection() {
    const section = this.containerEl.createDiv({ cls: ReviewCssClasses.COLOR_SECTION });
    section.createEl("h3", { text: ReviewSettingsText.THEMES_TITLE });
    new import_obsidian4.Setting(section).setName(ReviewSettingsText.THEME_ACTIVE_LABEL).addDropdown((dropdown) => {
      this.plugin.settings.themePresets.forEach((preset) => {
        dropdown.addOption(preset.id, preset.name);
      });
      dropdown.setValue(this.plugin.settings.activeThemePresetId || "").onChange(async (value) => {
        this.selectedThemeId = value;
        await this.plugin.activateThemePresetById(value);
        this.display();
      });
    });
    new import_obsidian4.Setting(section).setName(ReviewSettingsText.THEME_SAVE_NAME_LABEL).addText(
      (textInput) => textInput.setPlaceholder("Theme name").setValue(this.themeNameDraft).onChange((value) => {
        this.themeNameDraft = value;
      })
    ).addButton(
      (button) => button.setButtonText(ReviewSettingsText.THEME_SAVE_BUTTON_LABEL).onClick(async () => {
        await this.plugin.saveThemePresetByName(this.themeNameDraft, true);
        this.display();
      })
    );
    new import_obsidian4.Setting(section).setName(ReviewSettingsText.THEME_DELETE_LABEL).addDropdown((dropdown) => {
      this.plugin.settings.themePresets.forEach((preset) => {
        dropdown.addOption(preset.id, preset.name);
      });
      dropdown.setValue(this.selectedThemeId || this.plugin.settings.activeThemePresetId || "").onChange((value) => {
        this.selectedThemeId = value;
      });
    }).addButton(
      (button) => button.setButtonText(ReviewSettingsText.THEME_DELETE_BUTTON_LABEL).onClick(async () => {
        const targetId = this.selectedThemeId || this.plugin.settings.activeThemePresetId;
        if (!targetId) {
          return;
        }
        await this.plugin.deleteThemePresetById(targetId);
        this.display();
      })
    );
  }
};
