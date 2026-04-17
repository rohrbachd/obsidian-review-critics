import { ReviewParserDefaults } from './review-config';
import { ReviewSyntaxCatalog } from './review-constants';
import type {
  AnchoredCommentToken,
  CommentPaneEntry,
  CommentToken,
  IReviewParser,
  ReviewToken,
} from './review-types';

interface CandidateToken {
  type: 'addition' | 'deletion' | 'substitution' | 'highlight' | 'comment';
  from: number;
  to: number;
  text?: string;
  oldText?: string;
  newText?: string;
  author?: string;
}

interface ContentSegment {
  start: number;
  text: string;
}

interface HeadingEntry {
  from: number;
  text: string;
}

export class ReviewParser implements IReviewParser {
  private readonly syntax: ReviewSyntaxCatalog;

  constructor(syntax?: ReviewSyntaxCatalog) {
    this.syntax = syntax ?? new ReviewSyntaxCatalog();
  }

  parseTokens(content: string): ReviewToken[] {
    const candidates = this.collectCandidateTokens(content);
    const normalizedCandidates = this.normalizeOverlaps(candidates);
    const anchoredResult = this.buildAnchoredComments(content, normalizedCandidates);

    const output = this.buildTokenOutput(normalizedCandidates, anchoredResult.consumedIndexes);
    output.push(...anchoredResult.tokens);
    output.sort((a, b) => a.from - b.from || a.to - b.to);

    return output;
  }

  buildCommentEntries(content: string): CommentPaneEntry[] {
    const tokens = this.parseTokens(content);
    const lineStarts = this.getLineStarts(content);
    const headings = this.collectHeadings(content);

    const comments = tokens.filter((token): token is CommentToken | AnchoredCommentToken => {
      return token.type === 'comment' || token.type === 'anchoredComment';
    });

    return comments.map((token, index) => {
      const line = this.getLineNumber(lineStarts, token.from);
      const commentText = token.type === 'anchoredComment' ? token.commentText : token.text;
      const highlightedText = token.type === 'anchoredComment' ? token.highlightedText : undefined;

      return {
        id: [token.from, token.to, index].join(ReviewParserDefaults.COMMENT_ENTRY_ID_SEPARATOR),
        from: token.from,
        to: token.to,
        line,
        heading: this.getNearestHeading(headings, token.from),
        commentText,
        author: token.author,
        highlightedText,
      };
    });
  }

  private collectCandidateTokens(content: string): CandidateToken[] {
    const candidates: CandidateToken[] = [];
    const segments = this.getNonCodeSegments(content);
    const patterns = this.syntax.rules.tokenPatterns;

    for (const segment of segments) {
      this.collectMatches(segment, patterns.addition, (match, offset) => {
        candidates.push({
          type: 'addition',
          from: offset,
          to: offset + match[0].length,
          text: match[1],
        });
      });

      this.collectMatches(segment, patterns.deletion, (match, offset) => {
        candidates.push({
          type: 'deletion',
          from: offset,
          to: offset + match[0].length,
          text: match[1],
        });
      });

      this.collectMatches(segment, patterns.substitution, (match, offset) => {
        candidates.push({
          type: 'substitution',
          from: offset,
          to: offset + match[0].length,
          oldText: match[1],
          newText: match[2],
        });
      });

      this.collectMatches(segment, patterns.highlight, (match, offset) => {
        candidates.push({
          type: 'highlight',
          from: offset,
          to: offset + match[0].length,
          text: match[1],
        });
      });

      this.collectMatches(segment, patterns.comment, (match, offset) => {
        candidates.push({
          type: 'comment',
          from: offset,
          to: offset + match[0].length,
          author: match[1]?.trim() || undefined,
          text: match[2]?.trim() || '',
        });
      });
    }

    return candidates;
  }

  private normalizeOverlaps(candidates: CandidateToken[]): CandidateToken[] {
    const sorted = [...candidates].sort((a, b) => a.from - b.from || a.to - b.to);
    const normalized: CandidateToken[] = [];

    for (const token of sorted) {
      const previous = normalized[normalized.length - 1];
      if (previous && token.from < previous.to) {
        continue;
      }
      normalized.push(token);
    }

    return normalized;
  }

  private buildAnchoredComments(
    content: string,
    normalizedCandidates: CandidateToken[]
  ): { consumedIndexes: Set<number>; tokens: AnchoredCommentToken[] } {
    const consumedIndexes = new Set<number>();
    const anchoredTokens: AnchoredCommentToken[] = [];

    for (let index = 0; index < normalizedCandidates.length - 1; index += 1) {
      const current = normalizedCandidates[index];
      const next = normalizedCandidates[index + 1];

      if (current.type !== 'highlight' || next.type !== 'comment') {
        continue;
      }

      const betweenText = content.slice(current.to, next.from);
      if (!this.syntax.rules.anchoredWhitespacePattern.test(betweenText)) {
        continue;
      }

      consumedIndexes.add(index);
      consumedIndexes.add(index + 1);

      anchoredTokens.push({
        type: 'anchoredComment',
        from: current.from,
        to: next.to,
        highlightedText: current.text || '',
        commentText: next.text || '',
        author: next.author,
        highlightRange: { from: current.from, to: current.to },
        commentRange: { from: next.from, to: next.to },
      });
    }

    return { consumedIndexes, tokens: anchoredTokens };
  }

  private buildTokenOutput(
    candidates: CandidateToken[],
    consumedIndexes: Set<number>
  ): ReviewToken[] {
    const output: ReviewToken[] = [];

    candidates.forEach((token, index) => {
      if (consumedIndexes.has(index)) {
        return;
      }

      switch (token.type) {
        case 'addition':
        case 'deletion':
          output.push({
            type: token.type,
            from: token.from,
            to: token.to,
            text: token.text || '',
          });
          break;
        case 'substitution':
          output.push({
            type: 'substitution',
            from: token.from,
            to: token.to,
            oldText: token.oldText || '',
            newText: token.newText || '',
          });
          break;
        case 'highlight':
          output.push({
            type: 'highlight',
            from: token.from,
            to: token.to,
            text: token.text || '',
          });
          break;
        case 'comment':
          output.push({
            type: 'comment',
            from: token.from,
            to: token.to,
            text: token.text || '',
            author: token.author,
          });
          break;
      }
    });

    return output;
  }

  private getNonCodeSegments(content: string): ContentSegment[] {
    const lines = content.split(ReviewParserDefaults.LINE_BREAK);
    const segments: ContentSegment[] = [];
    const chunk: string[] = [];

    let inFence = false;
    let fenceMarker = '';
    let offset = 0;
    let chunkStart = 0;

    const flush = (nextOffset: number): void => {
      if (chunk.length === 0) {
        chunkStart = nextOffset;
        return;
      }

      segments.push({
        start: chunkStart,
        text: chunk.join(ReviewParserDefaults.LINE_BREAK),
      });
      chunk.length = 0;
      chunkStart = nextOffset;
    };

    lines.forEach((line, index) => {
      const isLast = index === lines.length - 1;
      const lineWithBreak = isLast ? line : `${line}${ReviewParserDefaults.LINE_BREAK}`;
      const fenceMatch = line.match(this.syntax.rules.fencePattern);

      if (fenceMatch) {
        const marker = fenceMatch[1][0];

        if (!inFence) {
          flush(offset);
          inFence = true;
          fenceMarker = marker;
        } else if (fenceMarker === marker) {
          inFence = false;
          chunkStart = offset + lineWithBreak.length;
        }

        offset += lineWithBreak.length;
        return;
      }

      if (!inFence) {
        chunk.push(line);
      }

      offset += lineWithBreak.length;
    });

    flush(offset);
    return segments;
  }

  private collectMatches(
    segment: ContentSegment,
    regex: RegExp,
    onMatch: (match: RegExpExecArray, offset: number) => void
  ): void {
    regex.lastIndex = 0;
    let match = regex.exec(segment.text);

    while (match) {
      onMatch(match, segment.start + match.index);
      match = regex.exec(segment.text);
    }
  }

  private getLineStarts(content: string): number[] {
    const starts = [0];

    for (let index = 0; index < content.length; index += 1) {
      if (content[index] === ReviewParserDefaults.LINE_BREAK) {
        starts.push(index + 1);
      }
    }

    return starts;
  }

  private getLineNumber(lineStarts: number[], offset: number): number {
    let low = 0;
    let high = lineStarts.length - 1;

    while (low <= high) {
      const midpoint = Math.floor((low + high) / 2);
      if (lineStarts[midpoint] <= offset) {
        low = midpoint + 1;
      } else {
        high = midpoint - 1;
      }
    }

    return Math.max(ReviewParserDefaults.FIRST_LINE_NUMBER, high + 1);
  }

  private collectHeadings(content: string): HeadingEntry[] {
    const headings: HeadingEntry[] = [];
    const lines = content.split(ReviewParserDefaults.LINE_BREAK);

    let offset = 0;
    lines.forEach((line, index) => {
      const headingMatch = line.match(this.syntax.rules.headingPattern);
      if (headingMatch) {
        headings.push({ from: offset, text: headingMatch[2].trim() });
      }

      offset += line.length;
      if (index < lines.length - 1) {
        offset += ReviewParserDefaults.LINE_BREAK.length;
      }
    });

    return headings;
  }

  private getNearestHeading(headings: HeadingEntry[], offset: number): string {
    let currentHeading = ReviewParserDefaults.DOCUMENT_ROOT_HEADING;

    for (const heading of headings) {
      if (heading.from > offset) {
        break;
      }
      currentHeading = heading.text;
    }

    return currentHeading;
  }
}
