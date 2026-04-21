import type { IReviewParser, ReviewToken } from './review-types';

export interface IDisplayModeRenderer {
  renderAcceptedTextForToken(token: ReviewToken): string;
  resolveAcceptedText(content: string, parser: IReviewParser): string;
}

export class DisplayModeRenderer implements IDisplayModeRenderer {
  renderAcceptedTextForToken(token: ReviewToken): string {
    switch (token.type) {
      case 'addition':
        return token.text;
      case 'deletion':
        return '';
      case 'substitution':
        return token.newText;
      case 'highlight':
        return token.text;
      case 'comment':
        return '';
      case 'anchoredComment':
        return token.highlightedText;
    }
  }

  resolveAcceptedText(content: string, parser: IReviewParser): string {
    const tokens = parser
      .parseTokens(content)
      .filter(
        (token): token is Extract<ReviewToken, { type: 'addition' | 'deletion' | 'substitution' }> =>
          token.type === 'addition' || token.type === 'deletion' || token.type === 'substitution'
      )
      .sort((a, b) => b.from - a.from);

    let output = content;
    for (const token of tokens) {
      const replacement = this.renderAcceptedTextForToken(token);
      output = `${output.slice(0, token.from)}${replacement}${output.slice(token.to)}`;
    }

    return output;
  }
}
