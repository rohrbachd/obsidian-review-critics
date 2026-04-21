import { ReviewDefaults } from './review-config';
import type { ThemePreset, ThemePresetPayload } from './review-types';

export interface IThemeIdGenerator {
  createId(): string;
}

export class TimestampThemeIdGenerator implements IThemeIdGenerator {
  createId(): string {
    return `custom-${Date.now()}`;
  }
}

export interface IThemePresetService {
  getDefaultThemePresets(): ThemePreset[];
  findByName(presets: ThemePreset[], name: string): ThemePreset | undefined;
  upsert(
    presets: ThemePreset[],
    name: string,
    payload: ThemePresetPayload,
    overwrite: boolean
  ): { presets: ThemePreset[]; saved: ThemePreset; overwritten: boolean };
  deletePreset(presets: ThemePreset[], presetId: string): ThemePreset[];
}

export class ThemePresetService implements IThemePresetService {
  private readonly idGenerator: IThemeIdGenerator;

  constructor(idGenerator?: IThemeIdGenerator) {
    this.idGenerator = idGenerator ?? new TimestampThemeIdGenerator();
  }

  getDefaultThemePresets(): ThemePreset[] {
    return ReviewDefaults.createDefaultThemePresets().map((preset) => ({ ...preset }));
  }

  findByName(presets: ThemePreset[], name: string): ThemePreset | undefined {
    const normalized = this.normalizeName(name);
    return presets.find((preset) => this.normalizeName(preset.name) === normalized);
  }

  upsert(
    presets: ThemePreset[],
    name: string,
    payload: ThemePresetPayload,
    overwrite: boolean
  ): { presets: ThemePreset[]; saved: ThemePreset; overwritten: boolean } {
    const existing = this.findByName(presets, name);
    if (existing && !overwrite) {
      throw new Error('duplicate_theme_name');
    }

    const nextPresets = presets.map((preset) => ({ ...preset }));
    if (existing) {
      const index = nextPresets.findIndex((preset) => preset.id === existing.id);
      const updated: ThemePreset = {
        ...existing,
        name: name.trim(),
        ...payload,
      };
      nextPresets[index] = updated;
      return { presets: nextPresets, saved: updated, overwritten: true };
    }

    const created: ThemePreset = {
      id: this.createUniqueId(nextPresets),
      name: name.trim(),
      isBuiltIn: false,
      ...payload,
    };
    nextPresets.push(created);
    return { presets: nextPresets, saved: created, overwritten: false };
  }

  deletePreset(presets: ThemePreset[], presetId: string): ThemePreset[] {
    const target = presets.find((preset) => preset.id === presetId);
    if (!target) {
      return presets;
    }

    if (target.isBuiltIn) {
      throw new Error('cannot_delete_builtin_theme');
    }

    return presets.filter((preset) => preset.id !== presetId);
  }

  private normalizeName(value: string): string {
    return value.trim().toLowerCase();
  }

  private createUniqueId(existing: ThemePreset[]): string {
    const base = this.idGenerator.createId();
    let candidate = base;
    let suffix = 1;

    while (existing.some((preset) => preset.id === candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    return candidate;
  }
}
