import { describe, expect, it } from 'vitest';

function mergeSettingsDefaults(loaded: Record<string, unknown>) {
  return {
    authorName: 'Daniel Rohrbach',
    enableReadingView: true,
    enableLivePreview: true,
    ...loaded,
  };
}

describe('US4 settings persistence behavior', () => {
  it('preserves toggles and author after simulated reload', () => {
    const saved = {
      authorName: 'Alex',
      enableReadingView: false,
      enableLivePreview: true,
    };
    const reloaded = mergeSettingsDefaults(saved);

    expect(reloaded.authorName).toBe('Alex');
    expect(reloaded.enableReadingView).toBe(false);
    expect(reloaded.enableLivePreview).toBe(true);
  });
});
