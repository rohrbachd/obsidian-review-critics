import { RangeSetBuilder } from '@codemirror/state';
import {
  Decoration,
  ViewPlugin,
  type DecorationSet,
  type EditorView,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import { ReviewReadingViewText } from './review-config';
import type { IReviewParser } from './review-types';

class HiddenDelimiterWidget extends WidgetType {
  toDOM(): HTMLElement {
    const element = document.createElement('span');
    element.className = 'review-live-hidden-delimiter';
    return element;
  }
}

class CommentBadgeWidget extends WidgetType {
  private readonly tooltipText: string;

  constructor(tooltipText: string) {
    super();
    this.tooltipText = tooltipText;
  }

  toDOM(): HTMLElement {
    const element = document.createElement('span');
    element.className = 'review-comment-badge review-live-comment-badge';
    element.textContent = ReviewReadingViewText.COMMENT_BADGE;
    element.setAttribute('role', 'note');
    element.setAttribute('data-review-tooltip', this.tooltipText);
    element.setAttribute('title', this.tooltipText);
    return element;
  }
}

class SubstitutionWidget extends WidgetType {
  private readonly oldText: string;
  private readonly newText: string;

  constructor(oldText: string, newText: string) {
    super();
    this.oldText = oldText;
    this.newText = newText;
  }

  toDOM(): HTMLElement {
    const wrapper = document.createElement('span');
    wrapper.className = 'review-live review-live-substitution';

    const oldSpan = document.createElement('span');
    oldSpan.className = 'review-live-substitution-old';
    oldSpan.textContent = this.oldText;

    const arrow = document.createElement('span');
    arrow.className = 'review-sub-arrow';
    arrow.textContent = ReviewReadingViewText.SUBSTITUTION_ARROW;

    const newSpan = document.createElement('span');
    newSpan.className = 'review-live-substitution-new';
    newSpan.textContent = this.newText;

    wrapper.append(oldSpan, arrow, newSpan);
    return wrapper;
  }
}

export class ReviewLivePreviewExtensionFactory {
  private readonly parser: IReviewParser;
  private readonly hiddenDelimiterWidget = new HiddenDelimiterWidget();

  constructor(parser: IReviewParser) {
    this.parser = parser;
  }

  createExtension(isEnabled: () => boolean) {
    const parser = this.parser;
    const hiddenDelimiterWidget = this.hiddenDelimiterWidget;

    class LivePreviewDecorations {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = ReviewLivePreviewExtensionFactory.buildDecorations(
          view,
          parser,
          isEnabled,
          hiddenDelimiterWidget
        );
      }

      update(update: ViewUpdate): void {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet ||
          update.focusChanged
        ) {
          this.decorations = ReviewLivePreviewExtensionFactory.buildDecorations(
            update.view,
            parser,
            isEnabled,
            hiddenDelimiterWidget
          );
        }
      }
    }

    return ViewPlugin.fromClass(LivePreviewDecorations, {
      decorations: (value) => value.decorations,
    });
  }

  private static buildDecorations(
    view: EditorView,
    parser: IReviewParser,
    isEnabled: () => boolean,
    hiddenDelimiterWidget: HiddenDelimiterWidget
  ): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();

    if (!isEnabled()) {
      return builder.finish();
    }

    let tokens: ReturnType<IReviewParser['parseTokens']>;
    try {
      const text = view.state.doc.toString();
      tokens = parser.parseTokens(text);
    } catch (error) {
      console.error('[obsidian-review-comments] Live Preview decoration failed.', error);
      return builder.finish();
    }

    const cursorOffset = view.state.selection.main.head;

    for (const token of tokens) {
      const tokenIsActive = cursorOffset >= token.from && cursorOffset <= token.to;

      if (tokenIsActive) {
        switch (token.type) {
          case 'addition':
            builder.add(
              token.from,
              token.to,
              Decoration.mark({
                class: 'review-live review-live-active-token review-live-addition',
              })
            );
            break;
          case 'deletion':
            builder.add(
              token.from,
              token.to,
              Decoration.mark({
                class: 'review-live review-live-active-token review-live-deletion',
              })
            );
            break;
          case 'substitution':
            builder.add(
              token.from,
              token.to,
              Decoration.mark({
                class: 'review-live review-live-active-token review-live-substitution',
              })
            );
            break;
          case 'highlight':
            builder.add(
              token.from,
              token.to,
              Decoration.mark({
                class: 'review-live review-live-active-token review-live-highlight',
              })
            );
            break;
          case 'comment':
            builder.add(
              token.from,
              token.to,
              Decoration.mark({
                class: 'review-live review-live-active-token review-live-comment',
              })
            );
            break;
          case 'anchoredComment':
            builder.add(
              token.highlightRange.from,
              token.highlightRange.to,
              Decoration.mark({
                class:
                  'review-live review-live-active-token review-live-highlight review-live-anchored',
              })
            );
            builder.add(
              token.commentRange.from,
              token.commentRange.to,
              Decoration.mark({
                class:
                  'review-live review-live-active-token review-live-comment review-live-anchored',
              })
            );
            break;
        }
        continue;
      }

      switch (token.type) {
        case 'addition':
          ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
            builder,
            token.from,
            token.to,
            3,
            3,
            'review-live review-live-addition',
            hiddenDelimiterWidget
          );
          break;
        case 'deletion':
          ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
            builder,
            token.from,
            token.to,
            3,
            3,
            'review-live review-live-deletion',
            hiddenDelimiterWidget
          );
          break;
        case 'substitution':
          builder.add(
            token.from,
            token.to,
            Decoration.replace({
              widget: new SubstitutionWidget(token.oldText, token.newText),
            })
          );
          break;
        case 'highlight':
          ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
            builder,
            token.from,
            token.to,
            3,
            3,
            'review-live review-live-highlight',
            hiddenDelimiterWidget
          );
          break;
        case 'comment':
          ReviewLivePreviewExtensionFactory.addCommentBadge(
            builder,
            token.from,
            token.to,
            token.author,
            token.text
          );
          break;
        case 'anchoredComment':
          ReviewLivePreviewExtensionFactory.addCriticTokenDecorations(
            builder,
            token.highlightRange.from,
            token.highlightRange.to,
            3,
            3,
            'review-live review-live-highlight review-live-anchored',
            hiddenDelimiterWidget
          );
          ReviewLivePreviewExtensionFactory.addCommentBadge(
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

  private static addCriticTokenDecorations(
    builder: RangeSetBuilder<Decoration>,
    from: number,
    to: number,
    openDelimiterLength: number,
    closeDelimiterLength: number,
    contentClassName: string,
    hiddenDelimiterWidget: HiddenDelimiterWidget
  ): void {
    const contentFrom = from + openDelimiterLength;
    const contentTo = to - closeDelimiterLength;

    if (contentTo <= contentFrom) {
      return;
    }

    ReviewLivePreviewExtensionFactory.addHiddenRange(
      builder,
      from,
      contentFrom,
      hiddenDelimiterWidget
    );
    builder.add(contentFrom, contentTo, Decoration.mark({ class: contentClassName }));
    ReviewLivePreviewExtensionFactory.addHiddenRange(builder, contentTo, to, hiddenDelimiterWidget);
  }

  private static addCommentBadge(
    builder: RangeSetBuilder<Decoration>,
    from: number,
    to: number,
    author: string | undefined,
    text: string
  ): void {
    if (to <= from) {
      return;
    }

    const tooltipText = ReviewLivePreviewExtensionFactory.buildCommentTooltip(author, text);
    builder.add(
      from,
      to,
      Decoration.replace({
        widget: new CommentBadgeWidget(tooltipText),
      })
    );
  }

  private static buildCommentTooltip(author: string | undefined, text: string): string {
    const normalizedText = text.trim() || '(empty comment)';
    if (!author) {
      return normalizedText;
    }

    return `${author}: ${normalizedText}`;
  }

  private static addHiddenRange(
    builder: RangeSetBuilder<Decoration>,
    from: number,
    to: number,
    hiddenDelimiterWidget: HiddenDelimiterWidget
  ): void {
    if (to <= from) {
      return;
    }

    builder.add(
      from,
      to,
      Decoration.replace({
        widget: hiddenDelimiterWidget,
      })
    );
  }
}
