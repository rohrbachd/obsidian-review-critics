import { EditorSelection, EditorState, type Extension } from '@codemirror/state';

export interface ITrackChangesService {
  applyTrackedEdit(
    content: string,
    from: number,
    to: number,
    insertedText: string
  ): TrackEditResult | null;
  shouldSkipTrackingForChange(
    sourceContent: string,
    from: number,
    to: number,
    insertedText: string,
    nextContent?: string,
    nextFrom?: number,
    nextTo?: number
  ): boolean;
  isSelectionSyntaxSensitive(content: string, from: number, to: number): boolean;
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
  private static readonly BLOCK_FENCE_PATTERN = /^\s*(```+|~~~+|\$\$)\s*$/m;
  private static readonly FOOTNOTE_DEFINITION_PATTERN = /^\s*\[\^[^\]]+\]:/m;
  private static readonly BLOCKQUOTE_OR_CALLOUT_PATTERN = /^\s*>\s*/m;
  private static readonly INLINE_STRUCTURAL_PATTERN =
    /!?\[[^\]]*]\([^)]+\)|\[\[[^\]]+\]\]|\[\^[^\]]+\]/;

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

    if (this.shouldSkipTrackingForChange(content, from, to, insertedText)) {
      return null;
    }

    const selected = content.slice(from, to);
    if (from !== to && this.isStructuredEdit(selected, insertedText)) {
      return null;
    }

    const insideAddition = this.findTokenContentRange(content, from, 'addition');
    const insideSubstitutionNew = this.findSubstitutionContentRange(content, from, 'new');
    const insideSubstitutionOld = this.findSubstitutionContentRange(content, from, 'old');
    const insideDeletion = this.findTokenContentRange(content, from, 'deletion');
    const insideComment = this.findCommentContentRange(content, from);

    if (from === to && insertedText.length > 0) {
      if (this.isInsideTokenDelimiter(content, from)) {
        return { content, cursor: from, preventDefault: true };
      }

      if (insideSubstitutionOld) {
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
      if (this.overlapsTokenDelimiters(content, from, to)) {
        return { content, cursor: from, preventDefault: true };
      }

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

      const insideSubstitutionNewFrom = this.findSubstitutionContentRange(content, from, 'new');
      const insideSubstitutionNewTo = this.findSubstitutionContentRange(
        content,
        Math.max(from, to - 1),
        'new'
      );
      if (
        insideSubstitutionNewFrom &&
        insideSubstitutionNewTo &&
        insideSubstitutionNewFrom.outerStart === insideSubstitutionNewTo.outerStart &&
        insideSubstitutionNewFrom.outerEnd === insideSubstitutionNewTo.outerEnd
      ) {
        const next = this.insertText(content, from, to, insertedText);
        return { content: next, cursor: from + insertedText.length };
      }

      const insideSubstitutionOldFrom = this.findSubstitutionContentRange(content, from, 'old');
      const insideSubstitutionOldTo = this.findSubstitutionContentRange(
        content,
        Math.max(from, to - 1),
        'old'
      );
      if (
        insideSubstitutionOldFrom &&
        insideSubstitutionOldTo &&
        insideSubstitutionOldFrom.outerStart === insideSubstitutionOldTo.outerStart &&
        insideSubstitutionOldFrom.outerEnd === insideSubstitutionOldTo.outerEnd
      ) {
        return { content, cursor: from, preventDefault: true };
      }

      if (selected.trim().length === 0) {
        let next = this.insertText(content, from, to, `{++${insertedText}++}`);
        next = this.mergeAdjacentTokens(next, '{++', '++}');
        return { content: next, cursor: from + insertedText.length + 3 };
      }

      const replacement = `{~~${selected}~>${insertedText}~~}`;
      const next = this.insertText(content, from, to, replacement);
      const cursor = from + 3 + selected.length + 2 + insertedText.length;
      return { content: next, cursor };
    }

    if (from !== to && insertedText.length === 0) {
      if (this.overlapsTokenDelimiters(content, from, to)) {
        return { content, cursor: from, preventDefault: true };
      }

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
        const nextInner = `${content.slice(insideAdditionFrom.start, from)}${content.slice(to, insideAdditionFrom.end)}`;
        if (nextInner.length === 0) {
          const next = this.insertText(
            content,
            insideAdditionFrom.outerStart,
            insideAdditionFrom.outerEnd,
            ''
          );
          return { content: next, cursor: insideAdditionFrom.outerStart };
        }
        const next = this.insertText(content, from, to, '');
        return { content: next, cursor: from };
      }

      const insideSubstitutionNewFrom = this.findSubstitutionContentRange(content, from, 'new');
      const insideSubstitutionNewTo = this.findSubstitutionContentRange(
        content,
        Math.max(from, to - 1),
        'new'
      );
      if (
        insideSubstitutionNewFrom &&
        insideSubstitutionNewTo &&
        insideSubstitutionNewFrom.outerStart === insideSubstitutionNewTo.outerStart &&
        insideSubstitutionNewFrom.outerEnd === insideSubstitutionNewTo.outerEnd
      ) {
        const next = this.insertText(content, from, to, '');
        return { content: next, cursor: from };
      }

      const insideSubstitutionOldFrom = this.findSubstitutionContentRange(content, from, 'old');
      const insideSubstitutionOldTo = this.findSubstitutionContentRange(
        content,
        Math.max(from, to - 1),
        'old'
      );
      if (
        insideSubstitutionOldFrom &&
        insideSubstitutionOldTo &&
        insideSubstitutionOldFrom.outerStart === insideSubstitutionOldTo.outerStart &&
        insideSubstitutionOldFrom.outerEnd === insideSubstitutionOldTo.outerEnd
      ) {
        return { content, cursor: from, preventDefault: true };
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

      let next = this.insertText(content, from, to, `{--${selected}--}`);
      next = this.mergeAdjacentTokens(next, '{--', '--}');
      return { content: next, cursor: from };
    }

    return null;
  }

  shouldSkipTrackingForChange(
    sourceContent: string,
    from: number,
    to: number,
    insertedText: string,
    nextContent?: string,
    nextFrom?: number,
    nextTo?: number
  ): boolean {
    if (
      from < 0 ||
      to < from ||
      from > sourceContent.length ||
      to > sourceContent.length
    ) {
      return true;
    }

    if (this.isSelectionSyntaxSensitive(sourceContent, from, to)) {
      return true;
    }

    if (nextContent !== undefined && nextFrom !== undefined && nextTo !== undefined) {
      if (
        nextFrom < 0 ||
        nextTo < nextFrom ||
        nextFrom > nextContent.length ||
        nextTo > nextContent.length
      ) {
        return true;
      }

      if (this.isSelectionSyntaxSensitive(nextContent, nextFrom, nextTo)) {
        return true;
      }
    }

    const selected = sourceContent.slice(from, to);
    if (this.isMarkdownStrikeThroughToggle(selected, insertedText)) {
      return true;
    }
    if (
      from === to &&
      insertedText.includes('\n') &&
      this.isLeadingStructuralLine(sourceContent, from)
    ) {
      return true;
    }

    if (
      this.looksLikeTableStructure(selected) ||
      this.looksLikeTableStructure(insertedText) ||
      this.containsSyntaxSensitiveMarkdown(selected) ||
      this.containsSyntaxSensitiveMarkdown(insertedText)
    ) {
      return true;
    }

    return false;
  }

  isSelectionSyntaxSensitive(content: string, from: number, to: number): boolean {
    if (from < 0 || to < from || to > content.length) {
      return true;
    }

    if (this.isInMarkdownTableContext(content, from, to)) {
      return true;
    }
    if (
      this.isInFencedCodeOrMathContext(content, from) ||
      this.isInFencedCodeOrMathContext(content, Math.max(from, to - 1))
    ) {
      return true;
    }
    if (this.isInsideInlineStructuralRange(content, from) || this.isInsideInlineStructuralRange(content, Math.max(from, to - 1))) {
      return true;
    }

    const lineRange = this.getLineRange(content, from, to);
    if (!lineRange) {
      return true;
    }

    const selected = content.slice(from, to);
    const selectedLines = content.slice(lineRange.start, lineRange.end);

    if (this.containsSyntaxSensitiveMarkdown(selected)) {
      return true;
    }

    if (
      TrackChangesService.BLOCK_FENCE_PATTERN.test(selectedLines) ||
      TrackChangesService.FOOTNOTE_DEFINITION_PATTERN.test(selectedLines) ||
      TrackChangesService.BLOCKQUOTE_OR_CALLOUT_PATTERN.test(selectedLines)
    ) {
      return true;
    }

    return false;
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

  private findSubstitutionContentRange(
    content: string,
    position: number,
    side: 'old' | 'new'
  ): TokenContentRange | null {
    const pattern = /\{~~([\s\S]*?)~>([\s\S]*?)~~\}/g;
    let match = pattern.exec(content);
    while (match) {
      const outerStart = match.index;
      const oldTextLength = match[1].length;
      const newTextLength = match[2].length;
      const oldStart = outerStart + 3;
      const oldEnd = oldStart + oldTextLength;
      const newStart = oldEnd + 2;
      const newEnd = newStart + newTextLength;
      const start = side === 'old' ? oldStart : newStart;
      const end = side === 'old' ? oldEnd : newEnd;
      if (position >= start && position <= end) {
        const outerEnd = outerStart + match[0].length;
        return { outerStart, outerEnd, start, end };
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

  private isInMarkdownTableContext(content: string, from: number, to: number): boolean {
    const lineRange = this.getLineRange(content, from, to);
    if (!lineRange) {
      return false;
    }

    const currentLine = content.slice(lineRange.start, lineRange.end);
    if (!currentLine.includes('|')) {
      return false;
    }

    const tableBlockLines = this.collectContiguousPipeLines(content, lineRange);
    if (tableBlockLines.length < 2) {
      return false;
    }

    const tableSeparator = /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/;
    return tableBlockLines.some((line) => tableSeparator.test(line));
  }

  private getLineRange(content: string, from: number, to: number): { start: number; end: number } | null {
    if (from < 0 || to < from || from > content.length || to > content.length) {
      return null;
    }

    const start = content.lastIndexOf('\n', from - 1) + 1;
    const endIdx = content.indexOf('\n', to);
    const end = endIdx === -1 ? content.length : endIdx;
    return { start, end };
  }

  private collectContiguousPipeLines(content: string, anchor: { start: number; end: number }): string[] {
    const lines: string[] = [];

    const anchorLine = content.slice(anchor.start, anchor.end);
    if (!anchorLine.includes('|')) {
      return lines;
    }

    lines.push(anchorLine);

    let upwardLineStart = anchor.start;
    while (upwardLineStart > 0) {
      const previousLineEnd = upwardLineStart - 1;
      const previousLineStart = content.lastIndexOf('\n', previousLineEnd - 1) + 1;
      const previousLine = content.slice(previousLineStart, previousLineEnd);
      if (!previousLine.includes('|')) {
        break;
      }
      lines.unshift(previousLine);
      upwardLineStart = previousLineStart;
    }

    let downwardLineEnd = anchor.end;
    while (downwardLineEnd < content.length) {
      if (content[downwardLineEnd] !== '\n') {
        break;
      }
      const nextLineStart = downwardLineEnd + 1;
      const nextLineEndIdx = content.indexOf('\n', nextLineStart);
      const nextLineEnd = nextLineEndIdx === -1 ? content.length : nextLineEndIdx;
      const nextLine = content.slice(nextLineStart, nextLineEnd);
      if (!nextLine.includes('|')) {
        break;
      }
      lines.push(nextLine);
      downwardLineEnd = nextLineEnd;
    }

    return lines;
  }

  private looksLikeTableStructure(text: string): boolean {
    if (!text.includes('|')) {
      return false;
    }

    if (text.includes('\n')) {
      return true;
    }

    const trimmed = text.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) {
      return false;
    }

    return (trimmed.match(/\|/g) ?? []).length >= 2;
  }

  private containsSyntaxSensitiveMarkdown(text: string): boolean {
    if (!text) {
      return false;
    }

    if (
      TrackChangesService.BLOCK_FENCE_PATTERN.test(text) ||
      TrackChangesService.FOOTNOTE_DEFINITION_PATTERN.test(text) ||
      TrackChangesService.BLOCKQUOTE_OR_CALLOUT_PATTERN.test(text)
    ) {
      return true;
    }

    if (TrackChangesService.INLINE_STRUCTURAL_PATTERN.test(text)) {
      return true;
    }

    return false;
  }

  private isMarkdownStrikeThroughToggle(selected: string, insertedText: string): boolean {
    if (!selected && !insertedText) {
      return false;
    }

    const strip = (value: string): string =>
      value.startsWith('~~') && value.endsWith('~~') && value.length >= 4 ? value.slice(2, -2) : value;

    const insertedLooksLikeMarkdownStrike =
      insertedText.startsWith('~~') &&
      insertedText.endsWith('~~') &&
      insertedText.length >= 4 &&
      !insertedText.includes('{~~') &&
      !insertedText.includes('~~}') &&
      strip(insertedText) === selected;

    const selectedLooksLikeMarkdownStrike =
      selected.startsWith('~~') &&
      selected.endsWith('~~') &&
      selected.length >= 4 &&
      !selected.includes('{~~') &&
      !selected.includes('~~}') &&
      strip(selected) === insertedText;

    return insertedLooksLikeMarkdownStrike || selectedLooksLikeMarkdownStrike;
  }

  private isLeadingStructuralLine(content: string, offset: number): boolean {
    if (offset < 0 || offset > content.length) {
      return true;
    }

    const lineStart = content.lastIndexOf('\n', Math.max(0, offset - 1)) + 1;
    if (offset !== lineStart) {
      return false;
    }
    const lineEndRaw = content.indexOf('\n', offset);
    const lineEnd = lineEndRaw === -1 ? content.length : lineEndRaw;
    const line = content.slice(offset, lineEnd);

    if (!line.trim()) {
      return false;
    }

    return (
      /^\s*#{1,6}\s+/.test(line) ||
      /^\s*(?:[-*+]|\d+\.)\s+/.test(line) ||
      /^\s*-\s+\[[ xX]\]\s+/.test(line) ||
      /^\s*>\s*/.test(line) ||
      /^\s*\|.*\|/.test(line) ||
      /^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line) ||
      /^\s*(```+|~~~+|\$\$)\s*$/.test(line)
    );
  }

  private isInsideInlineStructuralRange(content: string, position: number): boolean {
    if (position < 0 || position > content.length) {
      return true;
    }

    const regex = new RegExp(TrackChangesService.INLINE_STRUCTURAL_PATTERN.source, 'g');
    let match = regex.exec(content);
    while (match) {
      const start = match.index;
      const end = start + match[0].length;
      if (position >= start && position <= end) {
        return true;
      }
      match = regex.exec(content);
    }

    return false;
  }

  private isInFencedCodeOrMathContext(content: string, position: number): boolean {
    if (position < 0 || position > content.length) {
      return true;
    }

    const lines = content.split('\n');
    let offset = 0;
    let inBacktickFence = false;
    let inTildeFence = false;
    let inMathFence = false;

    for (const line of lines) {
      const lineStart = offset;
      const lineEnd = lineStart + line.length;

      const trimmed = line.trim();
      if (/^```+/.test(trimmed)) {
        inBacktickFence = !inBacktickFence;
      } else if (/^~~~+/.test(trimmed)) {
        inTildeFence = !inTildeFence;
      } else if (/^\$\$\s*$/.test(trimmed)) {
        inMathFence = !inMathFence;
      }

      if (position >= lineStart && position <= lineEnd) {
        return inBacktickFence || inTildeFence || inMathFence;
      }

      offset = lineEnd + 1;
    }

    return inBacktickFence || inTildeFence || inMathFence;
  }

  private isStructuredEdit(selected: string, insertedText: string): boolean {
    return (
      selected.includes('\n') ||
      insertedText.includes('\n') ||
      selected.includes('|') ||
      insertedText.includes('|')
    );
  }
}

export class TrackChangesExtensionFactory {
  private readonly trackChangesService: TrackChangesService;

  constructor(trackChangesService: TrackChangesService) {
    this.trackChangesService = trackChangesService;
  }

  createTransactionFilter(
    isEnabled: () => boolean,
    onTrackedBypass?: () => void
  ): Extension {
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
      let newFrom = 0;
      let newTo = 0;
      let insertedText = '';

      transaction.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        changeCount += 1;
        from = fromA;
        to = toA;
        newFrom = fromB;
        newTo = toB;
        insertedText = inserted.toString();
      });

      const source = transaction.startState.doc.toString();
      const next = transaction.newDoc.toString();
      if (changeCount !== 1) {
        const minimal = this.computeMinimalReplacement(source, next);
        from = minimal.from;
        to = minimal.to;
        insertedText = minimal.insert;
        newFrom = minimal.from;
        newTo = minimal.from + minimal.insert.length;
      }

      if (
        this.trackChangesService.shouldSkipTrackingForChange(
          source,
          from,
          to,
          insertedText,
          next,
          newFrom,
          newTo
        )
      ) {
        onTrackedBypass?.();
        return transaction;
      }
      const transformed = this.trackChangesService.applyTrackedEdit(source, from, to, insertedText);
      if (transformed?.preventDefault) {
        return {
          changes: [],
          selection: EditorSelection.cursor(
            Math.max(0, Math.min(source.length, transformed.cursor))
          ),
        };
      }

      if (!transformed || transformed.content === source) {
        return transaction;
      }

      if (transformed.content === transaction.newDoc.toString()) {
        return transaction;
      }

      const minimal = this.computeMinimalReplacement(source, transformed.content);

      return {
        changes: minimal,
        selection: EditorSelection.cursor(
          Math.max(0, Math.min(transformed.content.length, transformed.cursor))
        ),
      };
    });
  }

  private computeMinimalReplacement(
    source: string,
    target: string
  ): { from: number; to: number; insert: string } {
    let start = 0;
    const sourceLength = source.length;
    const targetLength = target.length;
    const minLength = Math.min(sourceLength, targetLength);
    while (start < minLength && source.charCodeAt(start) === target.charCodeAt(start)) {
      start += 1;
    }

    let sourceEnd = sourceLength;
    let targetEnd = targetLength;
    while (
      sourceEnd > start &&
      targetEnd > start &&
      source.charCodeAt(sourceEnd - 1) === target.charCodeAt(targetEnd - 1)
    ) {
      sourceEnd -= 1;
      targetEnd -= 1;
    }

    return {
      from: start,
      to: sourceEnd,
      insert: target.slice(start, targetEnd),
    };
  }
}
