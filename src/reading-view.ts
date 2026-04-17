import { type MarkdownPostProcessorContext } from 'obsidian';
import { ReviewReadingViewText } from './review-config';
import { ReviewSyntaxCatalog } from './review-constants';
import type { IReviewParser, ReviewToken } from './review-types';

export class ReviewReadingViewDecorator {
  private readonly parser: IReviewParser;
  private readonly syntax: ReviewSyntaxCatalog;

  constructor(parser: IReviewParser, syntax?: ReviewSyntaxCatalog) {
    this.parser = parser;
    this.syntax = syntax ?? new ReviewSyntaxCatalog();
  }

  decorate(root: HTMLElement, _context: MarkdownPostProcessorContext, enabled: boolean): void {
    if (!enabled) {
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
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

      const renderedFragment = this.renderInlineMarkup(sourceText);
      if (!renderedFragment) {
        continue;
      }

      textNode.replaceWith(renderedFragment);
    }
  }

  private renderInlineMarkup(input: string): DocumentFragment | null {
    const tokens = this.parser
      .parseTokens(input)
      .filter((token) => token.from >= 0 && token.to <= input.length);

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

  private appendTokenElement(fragment: DocumentFragment, token: ReviewToken): void {
    switch (token.type) {
      case 'addition': {
        const span = document.createElement('span');
        span.className = 'review-token review-token-addition';
        span.textContent = token.text;
        span.style.backgroundColor = 'var(--review-preview-addition)';
        span.style.color = 'var(--review-preview-text-addition)';
        fragment.append(span);
        return;
      }
      case 'deletion': {
        const span = document.createElement('span');
        span.className = 'review-token review-token-deletion';
        span.textContent = token.text;
        span.style.backgroundColor = 'var(--review-preview-deletion)';
        span.style.color = 'var(--review-preview-text-deletion)';
        span.style.textDecoration = 'line-through';
        fragment.append(span);
        return;
      }
      case 'substitution': {
        const wrapper = document.createElement('span');
        wrapper.className = 'review-token review-token-substitution';

        const oldElement = document.createElement('span');
        oldElement.className = 'review-sub-old';
        oldElement.textContent = token.oldText;
        oldElement.style.color = 'var(--review-preview-text-deletion)';
        oldElement.style.textDecoration = 'line-through';

        const arrowElement = document.createElement('span');
        arrowElement.className = 'review-sub-arrow';
        arrowElement.textContent = ReviewReadingViewText.SUBSTITUTION_ARROW;

        const newElement = document.createElement('span');
        newElement.className = 'review-sub-new';
        newElement.textContent = token.newText;
        newElement.style.color = 'var(--review-preview-text-addition)';
        newElement.style.fontWeight = '600';

        wrapper.append(oldElement, arrowElement, newElement);
        fragment.append(wrapper);
        return;
      }
      case 'highlight': {
        const mark = document.createElement('mark');
        mark.className = 'review-token review-token-highlight';
        mark.textContent = token.text;
        mark.style.backgroundColor = 'var(--review-preview-highlight)';
        mark.style.color = 'var(--review-preview-text-highlight)';
        fragment.append(mark);
        return;
      }
      case 'comment': {
        const commentBadge = document.createElement('span');
        commentBadge.className = 'review-comment-badge';
        commentBadge.textContent = ReviewReadingViewText.COMMENT_BADGE;
        commentBadge.setAttribute('role', 'note');

        const tooltip = this.buildCommentTooltip(token.author, token.text);
        commentBadge.setAttribute('data-review-tooltip', tooltip);
        commentBadge.setAttribute('title', tooltip);

        fragment.append(commentBadge);
        return;
      }
      case 'anchoredComment': {
        const highlight = document.createElement('mark');
        highlight.className =
          'review-token review-token-highlight review-token-anchored review-token-has-tooltip';
        highlight.textContent = token.highlightedText;

        const tooltip = this.buildCommentTooltip(token.author, token.commentText);
        highlight.setAttribute('data-review-tooltip', tooltip);
        highlight.setAttribute('title', tooltip);
        highlight.style.backgroundColor = 'var(--review-preview-highlight)';
        highlight.style.color = 'var(--review-preview-text-highlight)';

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
}
