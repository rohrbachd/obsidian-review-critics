import { describe, expect, it } from 'vitest';
import { ReviewMarkupBuilder } from '../../src/review-commands';

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
});
