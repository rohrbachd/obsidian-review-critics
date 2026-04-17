import { describe, expect, it } from 'vitest';
import { ReviewLivePreviewExtensionFactory } from '../../src/live-preview';
import { ReviewParser } from '../../src/review-parser';

describe('live-preview', () => {
  it('creates a codemirror extension instance', () => {
    const factory = new ReviewLivePreviewExtensionFactory(new ReviewParser());
    const ext = factory.createExtension(() => true);
    expect(ext).toBeDefined();
  });
});
