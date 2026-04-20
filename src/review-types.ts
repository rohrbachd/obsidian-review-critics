export type ReviewTokenType =
  | 'addition'
  | 'deletion'
  | 'substitution'
  | 'highlight'
  | 'comment'
  | 'anchoredComment';

export interface RangeOffset {
  from: number;
  to: number;
}

export interface TokenBase extends RangeOffset {
  type: ReviewTokenType;
}

export interface AdditionToken extends TokenBase {
  type: 'addition';
  text: string;
}

export interface DeletionToken extends TokenBase {
  type: 'deletion';
  text: string;
}

export interface SubstitutionToken extends TokenBase {
  type: 'substitution';
  oldText: string;
  newText: string;
}

export interface HighlightToken extends TokenBase {
  type: 'highlight';
  text: string;
}

export interface CommentToken extends TokenBase {
  type: 'comment';
  text: string;
  author?: string;
}

export interface AnchoredCommentToken extends TokenBase {
  type: 'anchoredComment';
  highlightedText: string;
  commentText: string;
  author?: string;
  highlightRange: RangeOffset;
  commentRange: RangeOffset;
}

export type ReviewToken =
  | AdditionToken
  | DeletionToken
  | SubstitutionToken
  | HighlightToken
  | CommentToken
  | AnchoredCommentToken;

export interface CommentPaneEntry {
  id: string;
  from: number;
  to: number;
  line: number;
  heading: string;
  commentText: string;
  author?: string;
  highlightedText?: string;
  isAnchored?: boolean;
  canResolve?: boolean;
  commentFrom?: number;
  commentTo?: number;
}

export type TrackedChangeType = 'addition' | 'deletion' | 'substitution';

export interface TrackedChangeEntry {
  id: string;
  type: TrackedChangeType;
  from: number;
  to: number;
  line: number;
  heading: string;
  context: string;
  text?: string;
  oldText?: string;
  newText?: string;
}

export type QuickActionType = 'add' | 'delete' | 'highlight' | 'replace' | 'comment';

export interface QuickActionRequest {
  action: QuickActionType;
  hasSelection: boolean;
  selectionText?: string;
  cursorOffset: number;
}

export interface ThemePresetPayload {
  previewColors: ReviewColorSettings;
  editingColors: ReviewColorSettings;
  previewTextColors: ReviewColorSettings;
  editingTextColors: ReviewColorSettings;
}

export interface ThemePreset extends ThemePresetPayload {
  id: string;
  name: string;
  isBuiltIn: boolean;
}

export interface ReviewPluginSettings {
  authorName: string;
  enableReadingView: boolean;
  enableLivePreview: boolean;
  trackChangesEnabled: boolean;
  acceptedTextViewEnabled: boolean;
  themePresets: ThemePreset[];
  activeThemePresetId?: string;
  previewColors: ReviewColorSettings;
  editingColors: ReviewColorSettings;
  previewTextColors: ReviewColorSettings;
  editingTextColors: ReviewColorSettings;
}

export interface ReviewColorSettings {
  insert: string;
  addition: string;
  deletion: string;
  comment: string;
  highlight: string;
}

export interface IReviewMarkupBuilder {
  createCommentMarkup(authorName: string): string;
  createAnchoredCommentMarkup(selection: string, authorName: string): string;
  wrapSelectionMarkup(selection: string, prefix: string, suffix: string): string;
  createSubstitutionMarkup(selection: string): string;
}

export interface IReviewParser {
  parseTokens(content: string): ReviewToken[];
  buildCommentEntries(content: string): CommentPaneEntry[];
  buildTrackedChangeEntries(content: string): TrackedChangeEntry[];
}
