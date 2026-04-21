import type { CommentPaneEntry, TrackedChangeEntry } from './review-types';

interface ResolutionRegexSet {
  addition: RegExp;
  deletion: RegExp;
  substitution: RegExp;
}

export interface IChangeResolutionService {
  resolveAllTrackedChangesAsAccepted(content: string): string;
  rejectTrackedChangeByMarkup(content: string, markup: string): string;
  resolveTrackedChange(
    content: string,
    entry: TrackedChangeEntry,
    action: 'accept' | 'reject'
  ): string;
  resolveCommentEntry(content: string, entry: CommentPaneEntry): string;
}

export class ChangeResolutionService implements IChangeResolutionService {
  private readonly regexSet: ResolutionRegexSet;

  constructor(regexSet?: Partial<ResolutionRegexSet>) {
    this.regexSet = {
      addition: regexSet?.addition ?? /\{\+\+([\s\S]*?)\+\+\}/g,
      deletion: regexSet?.deletion ?? /\{--([\s\S]*?)--\}/g,
      substitution: regexSet?.substitution ?? /\{~~([\s\S]*?)~>([\s\S]*?)~~\}/g,
    };
  }

  resolveAllTrackedChangesAsAccepted(content: string): string {
    return content
      .replace(this.regexSet.addition, '$1')
      .replace(this.regexSet.deletion, '')
      .replace(this.regexSet.substitution, '$2');
  }

  rejectTrackedChangeByMarkup(content: string, markup: string): string {
    if (!markup) {
      return content;
    }

    const escaped = this.escapeRegExp(markup);
    const scoped = new RegExp(escaped);
    const scopedMatch = scoped.exec(content);
    if (!scopedMatch) {
      return content;
    }

    const match = scopedMatch[0];
    const matchStart = scopedMatch.index;
    const matchEnd = matchStart + match.length;

    const additionPattern = /\{\+\+([\s\S]*?)\+\+\}/;
    const deletionPattern = /\{--([\s\S]*?)--\}/;
    const substitutionPattern = /\{~~([\s\S]*?)~>([\s\S]*?)~~\}/;

    const additionMatch = additionPattern.exec(match);
    if (additionMatch) {
      return `${content.slice(0, matchStart)}${content.slice(matchEnd)}`;
    }

    const deletionMatch = deletionPattern.exec(match);
    if (deletionMatch) {
      return `${content.slice(0, matchStart)}${deletionMatch[1] || ''}${content.slice(matchEnd)}`;
    }

    const substitutionMatch = substitutionPattern.exec(match);
    if (substitutionMatch) {
      return `${content.slice(0, matchStart)}${substitutionMatch[1] || ''}${content.slice(matchEnd)}`;
    }

    return content;
  }

  resolveTrackedChange(
    content: string,
    entry: TrackedChangeEntry,
    action: 'accept' | 'reject'
  ): string {
    const before = content.slice(0, entry.from);
    const after = content.slice(entry.to);

    let resolved = '';
    if (entry.type === 'addition') {
      resolved = action === 'accept' ? entry.text || '' : '';
    } else if (entry.type === 'deletion') {
      resolved = action === 'accept' ? '' : entry.text || '';
    } else {
      resolved = action === 'accept' ? entry.newText || '' : entry.oldText || '';
    }

    return `${before}${resolved}${after}`;
  }

  resolveCommentEntry(content: string, entry: CommentPaneEntry): string {
    if (typeof entry.commentFrom !== 'number' || typeof entry.commentTo !== 'number') {
      return content;
    }

    if (
      entry.commentFrom < 0 ||
      entry.commentTo < entry.commentFrom ||
      entry.commentTo > content.length
    ) {
      return content;
    }

    if (entry.isAnchored) {
      const before = content.slice(0, entry.from);
      const after = content.slice(entry.to);
      const preserved = entry.highlightedText ?? '';
      return `${before}${preserved}${after}`;
    }

    return `${content.slice(0, entry.commentFrom)}${content.slice(entry.commentTo)}`;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
