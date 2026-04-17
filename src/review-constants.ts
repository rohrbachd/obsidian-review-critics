import { ReviewRegexPatterns } from './review-config';

export interface ReviewTokenPatternSet {
  addition: RegExp;
  deletion: RegExp;
  substitution: RegExp;
  highlight: RegExp;
  comment: RegExp;
}

export interface ReviewSyntaxRules {
  tokenPatterns: ReviewTokenPatternSet;
  headingPattern: RegExp;
  fencePattern: RegExp;
  anchoredWhitespacePattern: RegExp;
  inlineTokenPattern: RegExp;
}

export class ReviewSyntaxCatalog {
  readonly rules: ReviewSyntaxRules;

  constructor(rules?: Partial<ReviewSyntaxRules>) {
    const tokenPatterns: ReviewTokenPatternSet = {
      addition: rules?.tokenPatterns?.addition ?? ReviewRegexPatterns.ADDITION,
      deletion: rules?.tokenPatterns?.deletion ?? ReviewRegexPatterns.DELETION,
      substitution: rules?.tokenPatterns?.substitution ?? ReviewRegexPatterns.SUBSTITUTION,
      highlight: rules?.tokenPatterns?.highlight ?? ReviewRegexPatterns.HIGHLIGHT,
      comment: rules?.tokenPatterns?.comment ?? ReviewRegexPatterns.COMMENT,
    };

    this.rules = {
      tokenPatterns,
      headingPattern: rules?.headingPattern ?? ReviewRegexPatterns.HEADING,
      fencePattern: rules?.fencePattern ?? ReviewRegexPatterns.FENCE,
      anchoredWhitespacePattern:
        rules?.anchoredWhitespacePattern ?? ReviewRegexPatterns.ANCHORED_WHITESPACE,
      inlineTokenPattern: rules?.inlineTokenPattern ?? ReviewRegexPatterns.INLINE_TOKEN,
    };
  }
}
