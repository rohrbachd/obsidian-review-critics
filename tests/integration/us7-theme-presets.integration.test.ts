import { describe, expect, it, vi } from 'vitest';
import ReviewPlugin from '../../src/main';

describe('us7 theme presets integration', () => {
  it('saves, activates, deletes presets and persists settings', async () => {
    const plugin = new ReviewPlugin({} as never, {} as never) as any;
    plugin.loadData = vi.fn().mockResolvedValue({});
    plugin.saveData = vi.fn().mockResolvedValue(undefined);
    plugin.refreshCommentsPane = vi.fn().mockResolvedValue(undefined);
    plugin.refreshChangesPane = vi.fn().mockResolvedValue(undefined);
    plugin.applyCssVariables = vi.fn();

    await plugin.loadSettings();
    const initialCount = plugin.settings.themePresets.length;

    await plugin.saveThemePresetByName('My Theme', false);
    expect(plugin.settings.themePresets.length).toBe(initialCount + 1);

    const saved = plugin.settings.themePresets.find((p: any) => p.name === 'My Theme');
    expect(saved).toBeDefined();
    await plugin.activateThemePresetById(saved.id);
    expect(plugin.settings.activeThemePresetId).toBe(saved.id);

    await plugin.deleteThemePresetById(saved.id);
    expect(plugin.settings.themePresets.length).toBe(initialCount);
  });
});
