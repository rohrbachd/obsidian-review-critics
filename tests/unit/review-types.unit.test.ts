import { describe, expect, it } from 'vitest';
import type { ReviewToken, ReviewPluginSettings } from '../../src/review-types';

describe('review types', () => {
  it('accepts canonical token and settings shapes', () => {
    const token: ReviewToken = { type: 'addition', from: 0, to: 8, text: 'a' };
    const settings: ReviewPluginSettings = {
      authorName: 'A',
      enableReadingView: true,
      enableLivePreview: true,
      previewColors: {
        insert: '#fff',
        addition: '#fff',
        deletion: '#fff',
        comment: '#fff',
        highlight: '#fff',
      },
      editingColors: {
        insert: '#fff',
        addition: '#fff',
        deletion: '#fff',
        comment: '#fff',
        highlight: '#fff',
      },
      previewTextColors: {
        insert: '#111',
        addition: '#111',
        deletion: '#111',
        comment: '#111',
        highlight: '#111',
      },
      editingTextColors: {
        insert: '#111',
        addition: '#111',
        deletion: '#111',
        comment: '#111',
        highlight: '#111',
      },
    };

    expect(token.type).toBe('addition');
    expect(settings.enableReadingView).toBe(true);
  });
});
