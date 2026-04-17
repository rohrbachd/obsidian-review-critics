import { ReviewMarkupSyntax } from './review-config';
import type { IReviewMarkupBuilder } from './review-types';

export class ReviewMarkupBuilder implements IReviewMarkupBuilder {
  createCommentMarkup(authorName: string): string {
    const author = authorName.trim();

    if (!author) {
      return `${ReviewMarkupSyntax.COMMENT_PREFIX}${ReviewMarkupSyntax.COMMENT_PADDING}${ReviewMarkupSyntax.COMMENT_SUFFIX}`;
    }

    return `${ReviewMarkupSyntax.COMMENT_PREFIX} ${ReviewMarkupSyntax.AUTHOR_PREFIX}${author}${ReviewMarkupSyntax.AUTHOR_SUFFIX}${ReviewMarkupSyntax.COMMENT_PADDING}${ReviewMarkupSyntax.COMMENT_SUFFIX}`;
  }

  createAnchoredCommentMarkup(selection: string, authorName: string): string {
    const highlight = `${ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_PREFIX}${selection}${ReviewMarkupSyntax.ANCHORED_HIGHLIGHT_SUFFIX}`;
    return `${highlight}${this.createCommentMarkup(authorName)}`;
  }

  wrapSelectionMarkup(selection: string, prefix: string, suffix: string): string {
    return `${prefix}${selection}${suffix}`;
  }

  createSubstitutionMarkup(selection: string): string {
    return `${ReviewMarkupSyntax.SUBSTITUTION_PREFIX}${selection}${ReviewMarkupSyntax.SUBSTITUTION_MIDDLE}${ReviewMarkupSyntax.SUBSTITUTION_SUFFIX}`;
  }
}
