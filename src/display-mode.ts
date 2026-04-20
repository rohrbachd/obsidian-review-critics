import type { ReviewToken } from './review-types';

export interface IDisplayModeRenderer {
  renderAcceptedTextForToken(token: ReviewToken): string;
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
}
