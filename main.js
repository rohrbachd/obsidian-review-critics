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
var import_obsidian2 = require("obsidian");

// src/comments-view.ts
var import_obsidian = require("obsidian");

// src/review-config.ts
var ReviewViewIds = class {
};
ReviewViewIds.COMMENTS_PANE = "review-comments-pane";
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
var ReviewSettingsText = class {
};
ReviewSettingsText.TAB_TITLE = "Review & CriticMarkup settings";
ReviewSettingsText.SETTINGS_DESCRIPTION = "Configure default author, rendering toggles, and token colors.";
ReviewSettingsText.AUTHOR_NAME_LABEL = "Default Author Name";
ReviewSettingsText.AUTHOR_NAME_PLACEHOLDER = "Your name";
ReviewSettingsText.AUTHOR_NAME_DESCRIPTION = "Used when inserting comments.";
ReviewSettingsText.ENABLE_READING_LABEL = "Enable Reading View Rendering";
ReviewSettingsText.ENABLE_LIVE_LABEL = "Enable Live Preview Decoration";
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
var ReviewNotices = class {
};
ReviewNotices.SELECT_TEXT_FIRST = "Select some text first.";
ReviewNotices.SELECT_TEXT_FOR_SUBSTITUTION = "Select text to mark as substitution.";
ReviewNotices.COULD_NOT_OPEN_COMMENTS_PANE = "Could not open comments pane.";
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
    return {
      authorName: _ReviewDefaults.AUTHOR_NAME,
      enableReadingView: true,
      enableLivePreview: true,
      previewColors: { ...colors },
      editingColors: { ...colors },
      previewTextColors: { ...textColors },
      editingTextColors: { ...textColors }
    };
  }
};
_ReviewDefaults.AUTHOR_NAME = "Daniel Rohrbach";
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
  constructor(leaf, onNavigate) {
    super(leaf);
    this.entries = [];
    this.onNavigate = onNavigate;
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
    });
  }
};
_ReviewCommentsView.VIEW_TYPE = ReviewViewIds.COMMENTS_PANE;
var ReviewCommentsView = _ReviewCommentsView;

// src/live-preview.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");
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
    element.setAttribute("title", this.tooltipText);
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
var ReviewLivePreviewExtensionFactory = class _ReviewLivePreviewExtensionFactory {
  constructor(parser) {
    this.hiddenDelimiterWidget = new HiddenDelimiterWidget();
    this.parser = parser;
  }
  createExtension(isEnabled) {
    const parser = this.parser;
    const hiddenDelimiterWidget = this.hiddenDelimiterWidget;
    class LivePreviewDecorations {
      constructor(view) {
        this.decorations = _ReviewLivePreviewExtensionFactory.buildDecorations(
          view,
          parser,
          isEnabled,
          hiddenDelimiterWidget
        );
      }
      update(update) {
        if (update.docChanged || update.viewportChanged || update.selectionSet || update.focusChanged) {
          this.decorations = _ReviewLivePreviewExtensionFactory.buildDecorations(
            update.view,
            parser,
            isEnabled,
            hiddenDelimiterWidget
          );
        }
      }
    }
    return import_view.ViewPlugin.fromClass(LivePreviewDecorations, {
      decorations: (value) => value.decorations
    });
  }
  static buildDecorations(view, parser, isEnabled, hiddenDelimiterWidget) {
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
    for (const token of tokens) {
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
        highlightedText
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
  constructor(parser, syntax) {
    this.parser = parser;
    this.syntax = syntax ?? new ReviewSyntaxCatalog();
  }
  decorate(root, _context, enabled) {
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
      const renderedFragment = this.renderInlineMarkup(sourceText);
      if (!renderedFragment) {
        continue;
      }
      textNode.replaceWith(renderedFragment);
    }
  }
  renderInlineMarkup(input) {
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
      this.appendTokenElement(fragment, token);
      cursor = token.to;
    }
    if (cursor < input.length) {
      fragment.append(input.slice(cursor));
    }
    return fragment;
  }
  appendTokenElement(fragment, token) {
    switch (token.type) {
      case "addition": {
        const span = document.createElement("span");
        span.className = "review-token review-token-addition";
        span.textContent = token.text;
        span.style.backgroundColor = "var(--review-preview-addition)";
        span.style.color = "var(--review-preview-text-addition)";
        fragment.append(span);
        return;
      }
      case "deletion": {
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
        commentBadge.setAttribute("title", tooltip);
        fragment.append(commentBadge);
        return;
      }
      case "anchoredComment": {
        const highlight = document.createElement("mark");
        highlight.className = "review-token review-token-highlight review-token-anchored review-token-has-tooltip";
        highlight.textContent = token.highlightedText;
        const tooltip = this.buildCommentTooltip(token.author, token.commentText);
        highlight.setAttribute("data-review-tooltip", tooltip);
        highlight.setAttribute("title", tooltip);
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

// src/main.ts
var ReviewPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.parser = new ReviewParser();
    this.markupBuilder = new ReviewMarkupBuilder();
    this.readingViewDecorator = new ReviewReadingViewDecorator(this.parser);
    this.livePreviewFactory = new ReviewLivePreviewExtensionFactory(this.parser);
  }
  async onload() {
    await this.loadSettings();
    this.applyCssVariables();
    this.registerView(
      ReviewCommentsView.VIEW_TYPE,
      (leaf) => new ReviewCommentsView(leaf, async (entry) => this.navigateToComment(entry))
    );
    this.registerMarkdownPostProcessor((element, context) => {
      try {
        this.readingViewDecorator.decorate(element, context, this.settings.enableReadingView);
      } catch (error) {
        console.error("[review-critic] Reading view decoration failed.", error);
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
  onunload() {
    this.app.workspace.detachLeavesOfType(ReviewCommentsView.VIEW_TYPE);
  }
  addCommands() {
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
      }
    });
    this.addCommand({
      id: ReviewCommands.ANCHORED_COMMENT_ID,
      name: ReviewCommands.ANCHORED_COMMENT_NAME,
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new import_obsidian2.Notice(ReviewNotices.SELECT_TEXT_FIRST);
          return;
        }
        editor.replaceSelection(
          this.markupBuilder.createAnchoredCommentMarkup(selection, this.settings.authorName)
        );
        void this.refreshCommentsPane();
      }
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
      }
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
      }
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
      }
    });
    this.addCommand({
      id: ReviewCommands.MARK_SUBSTITUTION_ID,
      name: ReviewCommands.MARK_SUBSTITUTION_NAME,
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new import_obsidian2.Notice(ReviewNotices.SELECT_TEXT_FOR_SUBSTITUTION);
          return;
        }
        editor.replaceSelection(this.markupBuilder.createSubstitutionMarkup(selection));
        void this.refreshCommentsPane();
      }
    });
    this.addCommand({
      id: ReviewCommands.OPEN_COMMENTS_PANE_ID,
      name: ReviewCommands.OPEN_COMMENTS_PANE_NAME,
      callback: async () => {
        await this.activateCommentsPane();
      }
    });
  }
  registerEvents() {
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
  wrapSelection(selection, replaceSelection, prefix, suffix) {
    if (!selection) {
      new import_obsidian2.Notice(ReviewNotices.SELECT_TEXT_FIRST);
      return;
    }
    replaceSelection(this.markupBuilder.wrapSelectionMarkup(selection, prefix, suffix));
  }
  async activateCommentsPane() {
    let leaf = this.app.workspace.getLeavesOfType(ReviewCommentsView.VIEW_TYPE)[0] ?? null;
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      if (!leaf) {
        new import_obsidian2.Notice(ReviewNotices.COULD_NOT_OPEN_COMMENTS_PANE);
        return;
      }
      await leaf.setViewState({ type: ReviewCommentsView.VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
    await this.refreshCommentsPane();
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
  async getEntriesForFile(file) {
    if (!file || file.extension !== ReviewDocumentKeys.MARKDOWN_EXTENSION) {
      return [];
    }
    const content = await this.app.vault.cachedRead(file);
    return this.parser.buildCommentEntries(content);
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
    const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
    const editor = view?.editor;
    if (!editor || typeof editor.offsetToPos !== "function") {
      return;
    }
    const position = editor.offsetToPos(entry.from);
    editor.setCursor(position);
    editor.setSelection(position, position);
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
    this.settings = {
      ...defaults,
      ...loadedSettings,
      previewColors: { ...defaultColors, ...loadedSettings?.previewColors || {} },
      editingColors: { ...defaultColors, ...loadedSettings?.editingColors || {} },
      previewTextColors: { ...defaultTextColors, ...loadedSettings?.previewTextColors || {} },
      editingTextColors: { ...defaultTextColors, ...loadedSettings?.editingTextColors || {} }
    };
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.applyCssVariables();
    await this.refreshCommentsPane();
  }
};
var ReviewSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: ReviewSettingsText.TAB_TITLE });
    containerEl.createEl("p", {
      text: ReviewSettingsText.SETTINGS_DESCRIPTION,
      cls: ReviewCssClasses.SETTINGS_PRD_LINK
    });
    new import_obsidian2.Setting(containerEl).setName(ReviewSettingsText.AUTHOR_NAME_LABEL).setDesc(ReviewSettingsText.AUTHOR_NAME_DESCRIPTION).addText(
      (textInput) => textInput.setPlaceholder(ReviewSettingsText.AUTHOR_NAME_PLACEHOLDER).setValue(this.plugin.settings.authorName).onChange(async (value) => {
        this.plugin.settings.authorName = value.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName(ReviewSettingsText.ENABLE_READING_LABEL).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableReadingView).onChange(async (value) => {
        this.plugin.settings.enableReadingView = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian2.Setting(containerEl).setName(ReviewSettingsText.ENABLE_LIVE_LABEL).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableLivePreview).onChange(async (value) => {
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
    new import_obsidian2.Setting(container).setName(label).setDesc(ReviewSettingsText.COLOR_DESCRIPTION).addText(
      (textInput) => textInput.setValue(value).onChange(async (nextValue) => {
        const normalized = nextValue.trim();
        if (normalized.length === 0) {
          return;
        }
        await onChange(normalized);
      })
    );
  }
};
