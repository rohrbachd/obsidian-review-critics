import { describe, expect, it, vi } from 'vitest';
import ReviewPlugin from '../../src/main';

describe('main plugin', () => {
  it('loads settings with defaults and overrides', async () => {
    const plugin = new ReviewPlugin({} as never, {} as never) as any;
    plugin.loadData = vi.fn().mockResolvedValue({ authorName: 'Alex', enableReadingView: false });
    await plugin.loadSettings();

    expect(plugin.settings.authorName).toBe('Alex');
    expect(plugin.settings.enableReadingView).toBe(false);
    expect(plugin.settings.enableLivePreview).toBe(true);
    expect(plugin.settings.trackChangesEnabled).toBe(false);
    expect(plugin.settings.acceptedTextViewEnabled).toBe(false);
    expect(plugin.settings.themePresets.length).toBeGreaterThan(0);
  });

  it('clears command lock when pre-command refresh throws', async () => {
    const plugin = new ReviewPlugin({} as never, {} as never) as any;
    let firstRefresh = true;
    plugin.refreshCommentsPane = vi.fn().mockImplementation(async () => {
      if (firstRefresh) {
        firstRefresh = false;
        throw new Error('refresh failed');
      }
    });
    plugin.refreshChangesPane = vi.fn().mockResolvedValue(undefined);

    await expect(plugin.runCommandExclusive(async () => 'first', true)).rejects.toThrow(
      'refresh failed'
    );
    expect(plugin.commandInFlight).toBe(false);

    await expect(plugin.runCommandExclusive(async () => 'second', true)).resolves.toBe('second');
    expect(plugin.commandInFlight).toBe(false);
  });
});
