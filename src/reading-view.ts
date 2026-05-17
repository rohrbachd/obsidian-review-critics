import { type MarkdownPostProcessorContext } from 'obsidian';
import { ReviewReadingViewText } from './review-config';
import { DisplayModeRenderer, type IDisplayModeRenderer } from './display-mode';
import { ReviewSyntaxCatalog } from './review-constants';
import type { IReviewParser, ReviewToken } from './review-types';

const INLINE_BOLD_ITALIC_PATTERN = /^\*\*\*([\s\S]+)\*\*\*$/;
const INLINE_BOLD_PATTERN = /^\*\*([\s\S]+)\*\*$/;
const INLINE_ITALIC_PATTERN = /^\*([\s\S]+)\*$/;
const INLINE_STRIKE_PATTERN = /^~~([\s\S]+)~~$/;

export class ReviewReadingViewDecorator {
  private readonly parser: IReviewParser;
  private readonly syntax: ReviewSyntaxCatalog;
  private readonly displayModeRenderer: IDisplayModeRenderer;

  constructor(
    parser: IReviewParser,
    syntax?: ReviewSyntaxCatalog,
    displayModeRenderer?: IDisplayModeRenderer
  ) {
    this.parser = parser;
    this.syntax = syntax ?? new ReviewSyntaxCatalog();
    this.displayModeRenderer = displayModeRenderer ?? new DisplayModeRenderer();
  }

  decorate(
    root: HTMLElement,
    _context: MarkdownPostProcessorContext,
    enabled: boolean,
    acceptedTextViewEnabled = false
  ): void {
    if (!enabled) {
      return;
    }

    const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];

    let currentNode = walker.nextNode();
    while (currentNode) {
      if (currentNode.parentElement && !currentNode.parentElement.closest('code, pre')) {
        textNodes.push(currentNode as Text);
      }
      currentNode = walker.nextNode();
    }

    for (const textNode of textNodes) {
      const sourceText = textNode.nodeValue || ReviewReadingViewText.EMPTY_TEXT;
      if (!sourceText.includes('{') || !this.syntax.rules.inlineTokenPattern.test(sourceText)) {
        continue;
      }

      const renderedFragment = this.renderInlineMarkup(sourceText, acceptedTextViewEnabled);
      if (!renderedFragment) {
        continue;
      }

      textNode.replaceWith(renderedFragment);
    }
  }

  private renderInlineMarkup(
    input: string,
    acceptedTextViewEnabled: boolean
  ): DocumentFragment | null {
    const tokens = this.parser
      .parseTokens(input)
      .filter((token) => token.from >= 0 && token.to <= input.length);

    if (tokens.length === 0) {
      return null;
    }

    const fragment = createFragment();
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

  private appendTokenElement(
    fragment: DocumentFragment,
    token: ReviewToken,
    acceptedTextViewEnabled: boolean
  ): void {
    switch (token.type) {
      case 'addition': {
        if (acceptedTextViewEnabled) {
          fragment.append(this.displayModeRenderer.renderAcceptedTextForToken(token));
          return;
        }
        const headingMatch = token.text.match(/^(#{1,6})\s+([\s\S]*)$/);
        if (headingMatch) {
          const level = Math.min(6, headingMatch[1].length);
          const heading = createEl(`h${level}` as keyof HTMLElementTagNameMap);
          heading.className = `review-token review-token-addition review-token-inline-heading review-token-struct-heading review-token-struct-heading-${headingMatch[1].length}`;
          heading.textContent = headingMatch[2];
          fragment.append(heading);
          return;
        }
        const span = createSpan({
          cls: 'review-token review-token-addition',
          text: token.text,
        });
        fragment.append(span);
        return;
      }
      case 'deletion': {
        if (acceptedTextViewEnabled) {
          return;
        }
        const span = createSpan({
          cls: 'review-token review-token-deletion',
          text: token.text,
        });
        fragment.append(span);
        return;
      }
      case 'substitution': {
        if (acceptedTextViewEnabled) {
          fragment.append(this.displayModeRenderer.renderAcceptedTextForToken(token));
          return;
        }
        const wrapper = createSpan({ cls: 'review-token review-token-substitution' });

        const oldElement = createSpan({
          cls: 'review-sub-old',
          text: token.oldText,
        });

        const arrowElement = createSpan({
          cls: 'review-sub-arrow',
          text: ReviewReadingViewText.SUBSTITUTION_ARROW,
        });

        const newElement = createSpan({ cls: 'review-sub-new' });
        this.appendInlineMarkdownFormatting(newElement, token.newText);

        wrapper.append(oldElement, arrowElement, newElement);
        fragment.append(wrapper);
        return;
      }
      case 'highlight': {
        const mark = createEl('mark', {
          cls: 'review-token review-token-highlight',
          text: token.text,
        });
        fragment.append(mark);
        return;
      }
      case 'comment': {
        const commentBadge = createSpan({
          cls: 'review-comment-badge',
          text: ReviewReadingViewText.COMMENT_BADGE,
        });
        commentBadge.setAttribute('role', 'note');

        const tooltip = this.buildCommentTooltip(token.author, token.text);
        commentBadge.setAttribute('data-review-tooltip', tooltip);

        fragment.append(commentBadge);
        return;
      }
      case 'anchoredComment': {
        const highlight = createEl('mark', {
          cls: 'review-token review-token-highlight review-token-anchored review-token-has-tooltip',
          text: token.highlightedText,
        });

        const tooltip = this.buildCommentTooltip(token.author, token.commentText);
        highlight.setAttribute('data-review-tooltip', tooltip);

        fragment.append(highlight);
        return;
      }
    }
  }

  private buildCommentTooltip(author: string | undefined, text: string): string {
    const normalizedText = text.trim() || ReviewReadingViewText.EMPTY_COMMENT_TEXT;
    if (!author) {
      return normalizedText;
    }

    return `${author}${ReviewReadingViewText.AUTHOR_SEPARATOR}${normalizedText}`;
  }

  private appendInlineMarkdownFormatting(container: HTMLElement, rawText: string): void {
    const boldItalicMatch = rawText.match(INLINE_BOLD_ITALIC_PATTERN);
    if (boldItalicMatch) {
      const strong = createEl('strong');
      const emphasis = createEl('em');
      emphasis.textContent = boldItalicMatch[1];
      strong.appendChild(emphasis);
      container.appendChild(strong);
      return;
    }

    const boldMatch = rawText.match(INLINE_BOLD_PATTERN);
    if (boldMatch) {
      const strong = createEl('strong');
      strong.textContent = boldMatch[1];
      container.appendChild(strong);
      return;
    }

    const italicMatch = rawText.match(INLINE_ITALIC_PATTERN);
    if (italicMatch) {
      const emphasis = createEl('em');
      emphasis.textContent = italicMatch[1];
      container.appendChild(emphasis);
      return;
    }

    const strikeMatch = rawText.match(INLINE_STRIKE_PATTERN);
    if (strikeMatch) {
      const strike = createEl('del');
      strike.textContent = strikeMatch[1];
      container.appendChild(strike);
      return;
    }

    container.textContent = rawText;
  }
}
