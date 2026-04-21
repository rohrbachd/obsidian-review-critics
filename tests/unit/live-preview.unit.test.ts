import { describe, expect, it } from 'vitest';
import { ReviewLivePreviewExtensionFactory } from '../../src/live-preview';
import { ReviewParser } from '../../src/review-parser';
import { EditorState } from '@codemirror/state';

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

  it('builds state extension for substitution-heavy documents without throwing', () => {
    const factory = new ReviewLivePreviewExtensionFactory(new ReviewParser());
    const extension = factory.createExtension(
      () => true,
      () => false
    );

    const state = EditorState.create({
      doc: '{~~old~>new~~}',
      extensions: [extension],
    });

    expect(state.doc.toString()).toBe('{~~old~>new~~}');
  });
});
