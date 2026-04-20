import { EditorSelection, EditorState, type Extension } from '@codemirror/state';

export interface ITrackChangesService {
  applyTrackedEdit(
    content: string,
    from: number,
    to: number,
    insertedText: string
  ): TrackEditResult | null;
}

export interface TrackEditResult {
  content: string;
  cursor: number;
  preventDefault?: boolean;
}

interface TokenContentRange {
  outerStart: number;
  outerEnd: number;
  start: number;
  end: number;
}

export class TrackChangesService implements ITrackChangesService {
  private skipNextTransaction = false;

  suppressNextTransaction(): void {
    this.skipNextTransaction = true;
  }

  consumeSuppressedTransaction(): boolean {
    if (!this.skipNextTransaction) {
      return false;
    }
    this.skipNextTransaction = false;
    return true;
  }

  applyTrackedEdit(
    content: string,
    from: number,
    to: number,
    insertedText: string
  ): TrackEditResult | null {
    if (from < 0 || to < from || to > content.length) {
      return null;
    }

    const selected = content.slice(from, to);
    const insideAddition = this.findTokenContentRange(content, from, 'addition');
    const insideSubstitutionNew = this.findSubstitutionNewContentRange(content, from);
    const insideDeletion = this.findTokenContentRange(content, from, 'deletion');
    const insideComment = this.findCommentContentRange(content, from);

    if (from === to && insertedText.length > 0) {
      if (this.isInsideTokenDelimiter(content, from)) {
        return { content, cursor: from, preventDefault: true };
      }

      if (insideComment) {
        const next = this.insertText(content, from, to, insertedText);
        return { content: next, cursor: from + insertedText.length };
      }

      if (insideSubstitutionNew) {
        const next = this.insertText(content, from, to, insertedText);
        return { content: next, cursor: from + insertedText.length };
      }

      if (insideAddition) {
        const next = this.insertText(content, from, to, insertedText);
        return { content: next, cursor: from + insertedText.length };
      }

      if (insideDeletion) {
        const left = content.slice(insideDeletion.start, from);
        const right = content.slice(from, insideDeletion.end);
        const replacement = `${this.wrapIfNotEmpty(left, '{--', '--}')}{++${insertedText}++}${this.wrapIfNotEmpty(right, '{--', '--}')}`;
        const next = this.insertText(content, insideDeletion.outerStart, insideDeletion.outerEnd, replacement);
        const cursorInsideNewAddition =
          insideDeletion.outerStart + this.wrapIfNotEmpty(left, '{--', '--}').length + 3 + insertedText.length;
        return { content: next, cursor: cursorInsideNewAddition };
      }

      let next = this.insertText(content, from, to, `{++${insertedText}++}`);
      next = this.mergeAdjacentTokens(next, '{++', '++}');
      const cursor = next.length;
      return { content: next, cursor: Math.min(cursor, from + insertedText.length + 3) };
    }

    if (from !== to && insertedText.length > 0) {
      const insideCommentFrom = this.findCommentContentRange(content, from);
      const insideCommentTo = this.findCommentContentRange(content, Math.max(from, to - 1));
      if (
        insideCommentFrom &&
        insideCommentTo &&
        insideCommentFrom.outerStart === insideCommentTo.outerStart &&
        insideCommentFrom.outerEnd === insideCommentTo.outerEnd
      ) {
        const next = this.insertText(content, from, to, insertedText);
        return { content: next, cursor: from + insertedText.length };
      }

      const insideAdditionFrom = this.findTokenContentRange(content, from, 'addition');
      const insideAdditionTo = this.findTokenContentRange(content, Math.max(from, to - 1), 'addition');
      if (
        insideAdditionFrom &&
        insideAdditionTo &&
        insideAdditionFrom.outerStart === insideAdditionTo.outerStart &&
        insideAdditionFrom.outerEnd === insideAdditionTo.outerEnd
      ) {
        const next = this.insertText(content, from, to, insertedText);
        return { content: next, cursor: from + insertedText.length };
      }

      if (this.overlapsTokenDelimiters(content, from, to)) {
        return { content, cursor: from, preventDefault: true };
      }

      const replacement = `{~~${selected}~>${insertedText}~~}`;
      const next = this.insertText(content, from, to, replacement);
      const cursor = from + 3 + selected.length + 2 + insertedText.length;
      return { content: next, cursor };
    }

    if (from !== to && insertedText.length === 0) {
      const insideCommentFrom = this.findCommentContentRange(content, from);
      const insideCommentTo = this.findCommentContentRange(content, Math.max(from, to - 1));
      if (
        insideCommentFrom &&
        insideCommentTo &&
        insideCommentFrom.outerStart === insideCommentTo.outerStart &&
        insideCommentFrom.outerEnd === insideCommentTo.outerEnd
      ) {
        const next = this.insertText(content, from, to, '');
        return { content: next, cursor: from };
      }

      const insideAdditionFrom = this.findTokenContentRange(content, from, 'addition');
      const insideAdditionTo = this.findTokenContentRange(content, Math.max(from, to - 1), 'addition');
      if (
        insideAdditionFrom &&
        insideAdditionTo &&
        insideAdditionFrom.outerStart === insideAdditionTo.outerStart &&
        insideAdditionFrom.outerEnd === insideAdditionTo.outerEnd
      ) {
        const next = this.insertText(content, from, to, '');
        return { content: next, cursor: from };
      }

      const insideDeletionFrom = this.findTokenContentRange(content, from, 'deletion');
      const insideDeletionTo = this.findTokenContentRange(content, Math.max(from, to - 1), 'deletion');
      if (
        insideDeletionFrom &&
        insideDeletionTo &&
        insideDeletionFrom.outerStart === insideDeletionTo.outerStart &&
        insideDeletionFrom.outerEnd === insideDeletionTo.outerEnd
      ) {
        return { content, cursor: from, preventDefault: true };
      }

      if (this.overlapsTokenDelimiters(content, from, to)) {
        return { content, cursor: from, preventDefault: true };
      }

      let next = this.insertText(content, from, to, `{--${selected}--}`);
      next = this.mergeAdjacentTokens(next, '{--', '--}');
      return { content: next, cursor: from };
    }

    return null;
  }

  private findCommentContentRange(
    content: string,
    position: number
  ): TokenContentRange | null {
    const pattern = /\{>>[\s\S]*?<<\}/g;
    let match = pattern.exec(content);
    while (match) {
      const outerStart = match.index;
      const outerEnd = match.index + match[0].length;
      const outer = match[0];
      const closeIndex = outer.lastIndexOf('<<}');
      if (closeIndex < 0) {
        match = pattern.exec(content);
        continue;
      }

      let contentStartInOuter = 3;

      const authorPrefixMatch = outer.slice(3).match(/^\s*\[author=[^\]]+\]/);
      if (authorPrefixMatch) {
        contentStartInOuter = 3 + authorPrefixMatch[0].length;
      }

      const start = outerStart + contentStartInOuter;
      const end = outerStart + closeIndex;
      if (position >= start && position <= end) {
        return { outerStart, outerEnd, start, end };
      }
      match = pattern.exec(content);
    }
    return null;
  }

  private findTokenContentRange(
    content: string,
    position: number,
    type: 'addition' | 'deletion'
  ): TokenContentRange | null {
    const open = type === 'addition' ? '{++' : '{--';
    const close = type === 'addition' ? '++}' : '--}';
    const pattern = type === 'addition' ? /\{\+\+([\s\S]*?)\+\+\}/g : /\{--([\s\S]*?)--\}/g;
    let match = pattern.exec(content);
    while (match) {
      const outerStart = match.index;
      const outerEnd = match.index + match[0].length;
      const start = outerStart + open.length;
      const end = outerEnd - close.length;
      if (position >= start && position <= end) {
        return { outerStart, outerEnd, start, end };
      }
      match = pattern.exec(content);
    }
    return null;
  }

  private findSubstitutionNewContentRange(
    content: string,
    position: number
  ): { start: number; end: number } | null {
    const pattern = /\{~~([\s\S]*?)~>([\s\S]*?)~~\}/g;
    let match = pattern.exec(content);
    while (match) {
      const outerStart = match.index;
      const oldTextLength = match[1].length;
      const newTextLength = match[2].length;
      const start = outerStart + 3 + oldTextLength + 2;
      const end = start + newTextLength;
      if (position >= start && position <= end) {
        return { start, end };
      }
      match = pattern.exec(content);
    }
    return null;
  }

  private mergeAdjacentTokens(content: string, open: string, close: string): string {
    const escapedOpen = open.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedClose = close.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `${escapedOpen}([\\s\\S]*?)${escapedClose}${escapedOpen}([\\s\\S]*?)${escapedClose}`,
      'g'
    );
    let next = content;
    let previous = '';
    while (next !== previous) {
      previous = next;
      next = next.replace(pattern, `${open}$1$2${close}`);
    }
    return next;
  }

  private insertText(content: string, from: number, to: number, value: string): string {
    return `${content.slice(0, from)}${value}${content.slice(to)}`;
  }

  private wrapIfNotEmpty(value: string, open: string, close: string): string {
    return value.length > 0 ? `${open}${value}${close}` : '';
  }

  private overlapsTokenDelimiters(content: string, from: number, to: number): boolean {
    const tokenDelimiterPattern = /\{\+\+|\+\+\}|\{--|--\}|\{~~|~>|~~\}|\{>>|<<\}/g;
    let match = tokenDelimiterPattern.exec(content);
    while (match) {
      const delimiterFrom = match.index;
      const delimiterTo = match.index + match[0].length;
      if (from < delimiterTo && to > delimiterFrom) {
        return true;
      }
      match = tokenDelimiterPattern.exec(content);
    }
    return false;
  }

  private isInsideTokenDelimiter(content: string, position: number): boolean {
    const tokenDelimiterPattern = /\{\+\+|\+\+\}|\{--|--\}|\{~~|~>|~~\}|\{>>|<<\}/g;
    let match = tokenDelimiterPattern.exec(content);
    while (match) {
      const delimiterFrom = match.index;
      const delimiterTo = match.index + match[0].length;
      if (position > delimiterFrom && position < delimiterTo) {
        return true;
      }
      match = tokenDelimiterPattern.exec(content);
    }
    return false;
  }
}

export class TrackChangesExtensionFactory {
  private readonly trackChangesService: TrackChangesService;

  constructor(trackChangesService: TrackChangesService) {
    this.trackChangesService = trackChangesService;
  }

  createTransactionFilter(isEnabled: () => boolean): Extension {
    return EditorState.transactionFilter.of((transaction) => {
      if (!isEnabled() || !transaction.docChanged) {
        return transaction;
      }

      if (this.trackChangesService.consumeSuppressedTransaction()) {
        return transaction;
      }

      let changeCount = 0;
      let from = 0;
      let to = 0;
      let insertedText = '';

      transaction.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
        changeCount += 1;
        from = fromA;
        to = toA;
        insertedText = inserted.toString();
      });

      if (changeCount !== 1) {
        return transaction;
      }

      const source = transaction.startState.doc.toString();
      const transformed = this.trackChangesService.applyTrackedEdit(source, from, to, insertedText);
      if (transformed?.preventDefault) {
        return {
          changes: { from: 0, to: source.length, insert: source },
          selection: EditorSelection.cursor(Math.max(0, transformed.cursor)),
        };
      }

      if (!transformed || transformed.content === source) {
        return transaction;
      }

      return {
        changes: { from: 0, to: source.length, insert: transformed.content },
        selection: EditorSelection.cursor(Math.max(0, transformed.cursor)),
      };
    });
  }
}
