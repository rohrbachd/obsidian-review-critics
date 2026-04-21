import { describe, expect, it } from 'vitest';
import { ThemePresetService } from '../../src/theme-presets';

describe('theme preset service', () => {
  const service = new ThemePresetService({
    createId: () => 'custom-1',
  });

  it('enforces case-insensitive uniqueness and supports overwrite', () => {
    const defaults = service.getDefaultThemePresets();
    const payload = {
      previewColors: defaults[0].previewColors,
      editingColors: defaults[0].editingColors,
      previewTextColors: defaults[0].previewTextColors,
      editingTextColors: defaults[0].editingTextColors,
    };

    const first = service.upsert(defaults, 'Review', payload, false);
    expect(() => service.upsert(first.presets, 'review', payload, false)).toThrow(
      'duplicate_theme_name'
    );

    const overwritten = service.upsert(first.presets, 'review', payload, true);
    expect(overwritten.overwritten).toBe(true);
  });

  it('blocks deletion of built-in presets', () => {
    const defaults = service.getDefaultThemePresets();
    expect(() => service.deletePreset(defaults, defaults[0].id)).toThrow(
      'cannot_delete_builtin_theme'
    );
  });

  it('derives unique ids when generated ids collide', () => {
    const collidingService = new ThemePresetService({
      createId: () => 'custom-collision',
    });
    const defaults = collidingService.getDefaultThemePresets();
    const payload = {
      previewColors: defaults[0].previewColors,
      editingColors: defaults[0].editingColors,
      previewTextColors: defaults[0].previewTextColors,
      editingTextColors: defaults[0].editingTextColors,
    };

    const first = collidingService.upsert(defaults, 'A', payload, false);
    const second = collidingService.upsert(first.presets, 'B', payload, false);

    expect(first.saved.id).toBe('custom-collision');
    expect(second.saved.id).toBe('custom-collision-1');
  });
});
