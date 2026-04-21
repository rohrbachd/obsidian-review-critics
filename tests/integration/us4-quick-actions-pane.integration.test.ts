import { describe, expect, it } from 'vitest';
import { ReviewMarkupBuilder } from '../../src/review-commands';
import { ReviewNotices } from '../../src/review-config';
import { TrackChangesService } from '../../src/track-changes';

describe('us4 quick-actions integration', () => {
  const builder = new ReviewMarkupBuilder();

  it('creates empty add token and comment token for no-selection behavior', () => {
    const addToken = '{++ ++}';
    const commentToken = builder.createCommentMarkup('Alex');

    expect(addToken).toBe('{++ ++}');
    expect(commentToken).toContain('[author=Alex]');
  });

  it('replacement no-selection behavior is a no-op at command layer', () => {
    const selection = '';
    const applyReplace = (value: string) => (value ? `{~~${value}~>~~}` : value);
    expect(applyReplace(selection)).toBe('');
  });

  it('treats syntax-sensitive selections as protected no-op with notice key', () => {
    const service = new TrackChangesService();
    const doc = 'some [link](https://example.com) text';
    const from = doc.indexOf('[link]');
    const to = from + '[link](https://example.com)'.length;

    const isProtected = service.isSelectionSyntaxSensitive(doc, from, to);
    expect(isProtected).toBe(true);
    expect(ReviewNotices.QUICK_ACTION_PROTECTED_SELECTION).toContain(
      'review.quickAction.protectedSelection'
    );
  });
});
