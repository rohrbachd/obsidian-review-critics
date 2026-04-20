import { describe, expect, it } from 'vitest';
import { ReviewLivePreviewExtensionFactory } from '../../src/live-preview';
import { ReviewParser } from '../../src/review-parser';

describe('live-preview', () => {
  it('creates a codemirror extension instance', () => {
    const factory = new ReviewLivePreviewExtensionFactory(new ReviewParser());
    const ext = factory.createExtension(() => true);
    expect(ext).toBeDefined();
  });

  it('creates extension with accepted-text mode callback', () => {
    const factory = new ReviewLivePreviewExtensionFactory(new ReviewParser());
    const ext = factory.createExtension(
      () => true,
      () => true
    );
    expect(ext).toBeDefined();
  });
});
