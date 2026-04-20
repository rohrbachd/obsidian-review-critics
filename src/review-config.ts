import type { ReviewColorSettings, ReviewPluginSettings, ThemePreset } from './review-types';

export class ReviewViewIds {
  static readonly COMMENTS_PANE = 'review-comments-pane';
  static readonly CHANGES_PANE = 'review-changes-pane';
  static readonly QUICK_ACTIONS_PANE = 'review-quick-actions-pane';
  static readonly MARKDOWN = 'markdown';
}

export class ReviewCommands {
  static readonly INSERT_COMMENT_ID = 'insert-review-comment';
  static readonly INSERT_COMMENT_NAME = 'Comment';

  static readonly ANCHORED_COMMENT_ID = 'add-comment-to-selection';
  static readonly ANCHORED_COMMENT_NAME = 'Comment Selection';

  static readonly HIGHLIGHT_SELECTION_ID = 'mark-selection-highlight';
  static readonly HIGHLIGHT_SELECTION_NAME = 'Highlight';

  static readonly MARK_ADDITION_ID = 'mark-selection-addition';
  static readonly MARK_ADDITION_NAME = 'Add';

  static readonly MARK_DELETION_ID = 'mark-selection-deletion';
  static readonly MARK_DELETION_NAME = 'Delete';

  static readonly MARK_SUBSTITUTION_ID = 'mark-selection-substitution';
  static readonly MARK_SUBSTITUTION_NAME = 'Replace';

  static readonly OPEN_COMMENTS_PANE_ID = 'open-review-comments-pane';
  static readonly OPEN_COMMENTS_PANE_NAME = 'Comments Pane';

  static readonly OPEN_CHANGES_PANE_ID = 'open-review-changes-pane';
  static readonly OPEN_CHANGES_PANE_NAME = 'Changes Pane';

  static readonly OPEN_QUICK_ACTIONS_PANE_ID = 'open-review-quick-actions-pane';
  static readonly OPEN_QUICK_ACTIONS_PANE_NAME = 'Quick Actions Pane';

  static readonly TOGGLE_TRACK_CHANGES_ID = 'toggle-track-changes-mode';
  static readonly TOGGLE_TRACK_CHANGES_NAME = 'Toggle Track Changes Mode';

  static readonly TOGGLE_ACCEPTED_TEXT_VIEW_ID = 'toggle-accepted-text-view';
  static readonly TOGGLE_ACCEPTED_TEXT_VIEW_NAME = 'Toggle Accepted Text View';

  static readonly ACCEPT_ALL_CHANGES_ID = 'accept-all-tracked-changes';
  static readonly ACCEPT_ALL_CHANGES_NAME = 'Accept All Tracked Changes';

  static readonly ACCEPT_CHANGE_AT_CURSOR_ID = 'accept-tracked-change-at-cursor';
  static readonly ACCEPT_CHANGE_AT_CURSOR_NAME = 'Accept Tracked Change At Cursor';

  static readonly REJECT_CHANGE_AT_CURSOR_ID = 'reject-tracked-change-at-cursor';
  static readonly REJECT_CHANGE_AT_CURSOR_NAME = 'Reject Tracked Change At Cursor';
}

export class ReviewSettingsText {
  static readonly TAB_TITLE = 'Review & CriticMarkup settings';
  static readonly SETTINGS_DESCRIPTION =
    'Configure default author, rendering toggles, and token colors.';

  static readonly AUTHOR_NAME_LABEL = 'Default Author Name';
  static readonly AUTHOR_NAME_PLACEHOLDER = 'Your name';
  static readonly AUTHOR_NAME_DESCRIPTION = 'Used when inserting comments.';

  static readonly ENABLE_READING_LABEL = 'Enable Reading View Rendering';
  static readonly ENABLE_LIVE_LABEL = 'Enable Live Preview Decoration';
  static readonly ENABLE_TRACK_CHANGES_LABEL = 'Enable Track Changes Mode';
  static readonly ENABLE_ACCEPTED_TEXT_LABEL = 'Enable Accepted Text View';

  static readonly PREVIEW_COLORS_TITLE = 'Preview Mode Colors';
  static readonly EDITING_COLORS_TITLE = 'Editing Mode Colors';
  static readonly PREVIEW_TEXT_COLORS_TITLE = 'Preview Mode Text Colors';
  static readonly EDITING_TEXT_COLORS_TITLE = 'Editing Mode Text Colors';

  static readonly COLOR_INSERT_LABEL = 'Insert';
  static readonly COLOR_ADDITION_LABEL = 'Addition';
  static readonly COLOR_DELETION_LABEL = 'Deletion';
  static readonly COLOR_COMMENT_LABEL = 'Comment';
  static readonly COLOR_HIGHLIGHT_LABEL = 'Highlight';
  static readonly COLOR_DESCRIPTION = 'Hex color, e.g. #daf7dc';

  static readonly THEMES_TITLE = 'Theme Presets';
  static readonly THEME_ACTIVE_LABEL = 'Active Theme';
  static readonly THEME_SAVE_NAME_LABEL = 'Theme Name';
  static readonly THEME_SAVE_BUTTON_LABEL = 'Save Theme';
  static readonly THEME_DELETE_LABEL = 'Delete Theme';
  static readonly THEME_DELETE_BUTTON_LABEL = 'Delete Selected Theme';
}

export class ReviewNotices {
  static readonly SELECT_TEXT_FIRST = 'Select some text first.';
  static readonly SELECT_TEXT_FOR_SUBSTITUTION = 'Select text to mark as substitution.';
  static readonly COULD_NOT_OPEN_COMMENTS_PANE = 'Could not open comments pane.';
  static readonly COULD_NOT_OPEN_CHANGES_PANE = 'Could not open changes pane.';
  static readonly COULD_NOT_OPEN_QUICK_ACTIONS_PANE = 'Could not open quick actions pane.';
  static readonly NO_ACTIVE_MARKDOWN_EDITOR = 'No active Markdown editor found.';
  static readonly TRACK_CHANGES_ENABLED = 'Track Changes Mode enabled.';
  static readonly TRACK_CHANGES_DISABLED = 'Track Changes Mode disabled.';
  static readonly ACCEPTED_TEXT_VIEW_ENABLED = 'Accepted Text View enabled.';
  static readonly ACCEPTED_TEXT_VIEW_DISABLED = 'Accepted Text View disabled.';
  static readonly THEME_SAVED = 'Theme preset saved.';
  static readonly THEME_DELETED = 'Theme preset deleted.';
  static readonly THEME_DUPLICATE = 'Theme name exists. Overwrite enabled for this save.';
  static readonly THEME_DELETE_BLOCKED = 'Built-in presets cannot be deleted.';
}

export class ReviewCssClasses {
  static readonly SETTINGS_PRD_LINK = 'review-settings-prd-link';
  static readonly COLOR_SECTION = 'review-color-section';
}

export class ReviewDocumentKeys {
  static readonly MARKDOWN_EXTENSION = 'md';
}

export class ReviewCommentsPaneText {
  static readonly DISPLAY_TEXT = 'Review comments';
  static readonly ICON = 'message-square';
  static readonly TITLE = 'Comments in current note';
  static readonly EMPTY_STATE = 'No comments found in this note.';
  static readonly UNKNOWN_AUTHOR = 'Unknown author';
  static readonly EMPTY_COMMENT = '(empty comment)';
  static readonly LINE_PREFIX = 'Line ';
  static readonly SNIPPET_PREFIX = 'On: "';
  static readonly SNIPPET_SUFFIX = '"';
  static readonly SECTION_PREFIX = 'Section: ';
}

export class ReviewChangesPaneText {
  static readonly DISPLAY_TEXT = 'Tracked changes';
  static readonly ICON = 'git-compare';
  static readonly TITLE = 'Changes in current note';
  static readonly EMPTY_STATE = 'No tracked changes found in this note.';
}

export class ReviewQuickActionsPaneText {
  static readonly DISPLAY_TEXT = 'Quick actions';
  static readonly ICON = 'mouse-pointer-click';
  static readonly TITLE = 'Quick actions';
}

export class ReviewWorkspaceEvents {
  static readonly ACTIVE_LEAF_CHANGE = 'active-leaf-change';
  static readonly FILE_OPEN = 'file-open';
  static readonly MODIFY = 'modify';
}

export class ReviewCssVariables {
  static readonly PREVIEW_INSERT = '--review-preview-insert';
  static readonly PREVIEW_ADDITION = '--review-preview-addition';
  static readonly PREVIEW_DELETION = '--review-preview-deletion';
  static readonly PREVIEW_COMMENT = '--review-preview-comment';
  static readonly PREVIEW_HIGHLIGHT = '--review-preview-highlight';

  static readonly EDIT_INSERT = '--review-edit-insert';
  static readonly EDIT_ADDITION = '--review-edit-addition';
  static readonly EDIT_DELETION = '--review-edit-deletion';
  static readonly EDIT_COMMENT = '--review-edit-comment';
  static readonly EDIT_HIGHLIGHT = '--review-edit-highlight';

  static readonly PREVIEW_TEXT_INSERT = '--review-preview-text-insert';
  static readonly PREVIEW_TEXT_ADDITION = '--review-preview-text-addition';
  static readonly PREVIEW_TEXT_DELETION = '--review-preview-text-deletion';
  static readonly PREVIEW_TEXT_COMMENT = '--review-preview-text-comment';
  static readonly PREVIEW_TEXT_HIGHLIGHT = '--review-preview-text-highlight';

  static readonly EDIT_TEXT_INSERT = '--review-edit-text-insert';
  static readonly EDIT_TEXT_ADDITION = '--review-edit-text-addition';
  static readonly EDIT_TEXT_DELETION = '--review-edit-text-deletion';
  static readonly EDIT_TEXT_COMMENT = '--review-edit-text-comment';
  static readonly EDIT_TEXT_HIGHLIGHT = '--review-edit-text-highlight';
}

export class ReviewDefaults {
  static readonly AUTHOR_NAME = 'Daniel Rohrbach';
  static readonly DEFAULT_THEME_PRESET_ID = 'default';
  static readonly DEFAULT_THEME_PRESET_NAME = 'Default';

  static createDefaultColors(): ReviewColorSettings {
    return {
      insert: '#daf7dc',
      addition: '#daf7dc',
      deletion: '#ffd4d4',
      comment: '#d8e9ff',
      highlight: '#fff1a8',
    };
  }

  static createDefaultTextColors(): ReviewColorSettings {
    return {
      insert: '#166534',
      addition: '#166534',
      deletion: '#b42318',
      comment: '#1e3a8a',
      highlight: '#1f2937',
    };
  }

  static createDefaultSettings(): ReviewPluginSettings {
    const colors = ReviewDefaults.createDefaultColors();
    const textColors = ReviewDefaults.createDefaultTextColors();
    const presets = ReviewDefaults.createDefaultThemePresets();

    return {
      authorName: ReviewDefaults.AUTHOR_NAME,
      enableReadingView: true,
      enableLivePreview: true,
      trackChangesEnabled: false,
      acceptedTextViewEnabled: false,
      themePresets: presets,
      activeThemePresetId: ReviewDefaults.DEFAULT_THEME_PRESET_ID,
      previewColors: { ...colors },
      editingColors: { ...colors },
      previewTextColors: { ...textColors },
      editingTextColors: { ...textColors },
    };
  }

  static createDefaultThemePresets(): ThemePreset[] {
    return [
      {
        id: ReviewDefaults.DEFAULT_THEME_PRESET_ID,
        name: ReviewDefaults.DEFAULT_THEME_PRESET_NAME,
        isBuiltIn: true,
        previewColors: ReviewDefaults.createDefaultColors(),
        editingColors: ReviewDefaults.createDefaultColors(),
        previewTextColors: ReviewDefaults.createDefaultTextColors(),
        editingTextColors: ReviewDefaults.createDefaultTextColors(),
      },
    ];
  }
}

export class ReviewParserDefaults {
  static readonly DOCUMENT_ROOT_HEADING = 'Document root';
  static readonly LINE_BREAK = '\n';
  static readonly COMMENT_ENTRY_ID_SEPARATOR = ':';
  static readonly FIRST_LINE_NUMBER = 1;
}

export class ReviewReadingViewText {
  static readonly SUBSTITUTION_ARROW = ' -> ';
  static readonly AUTHOR_SEPARATOR = ': ';
  static readonly EMPTY_TEXT = '';
  static readonly COMMENT_BADGE = '💬';
  static readonly EMPTY_COMMENT_TEXT = '(empty comment)';
}

export class ReviewMarkupSyntax {
  static readonly COMMENT_PREFIX = '{>>';
  static readonly COMMENT_SUFFIX = '<<}';
  static readonly AUTHOR_PREFIX = '[author=';
  static readonly AUTHOR_SUFFIX = ']';
  static readonly COMMENT_PADDING = '  ';

  static readonly ANCHORED_HIGHLIGHT_PREFIX = '{==';
  static readonly ANCHORED_HIGHLIGHT_SUFFIX = '==}';

  static readonly ADDITION_PREFIX = '{++';
  static readonly ADDITION_SUFFIX = '++}';
  static readonly DELETION_PREFIX = '{--';
  static readonly DELETION_SUFFIX = '--}';
  static readonly SUBSTITUTION_PREFIX = '{~~';
  static readonly SUBSTITUTION_MIDDLE = '~>';
  static readonly SUBSTITUTION_SUFFIX = '~~}';
}

export class ReviewRegexPatterns {
  static readonly ADDITION = /(?:\{\+\+|‹\+\+)([\s\S]+?)(?:\+\+\}|\+\+›)/g;
  static readonly DELETION = /(?:\{--|‹--)([\s\S]+?)(?:--\}|--›)/g;
  static readonly SUBSTITUTION = /(?:\{~~|‹~~)([\s\S]+?)~>([\s\S]*?)(?:~~\}|~~›)/g;
  static readonly HIGHLIGHT = /(?:\{==|‹==)([\s\S]+?)(?:==\}|==›)/g;
  static readonly COMMENT = /(?:\{>>|‹>>)\s*(?:\[author=([^\]]+)\]\s*)?([\s\S]*?)\s*(?:<<\}|<<›)/g;

  static readonly HEADING = /^(#{1,6})\s+(.+)$/;
  static readonly FENCE = /^\s*(```+|~~~+)/;
  static readonly ANCHORED_WHITESPACE = /^\s*$/;
  static readonly INLINE_TOKEN =
    /(?:\{\+\+|‹\+\+)[\s\S]+?(?:\+\+\}|\+\+›)|(?:\{--|‹--)[\s\S]+?(?:--\}|--›)|(?:\{~~|‹~~)[\s\S]+?~>[\s\S]*?(?:~~\}|~~›)|(?:\{==|‹==)[\s\S]+?(?:==\}|==›)|(?:\{>>|‹>>)\s*(?:\[author=[^\]]+\]\s*)?[\s\S]*?\s*(?:<<\}|<<›)/;
}
