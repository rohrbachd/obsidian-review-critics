import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('no network usage guard', () => {
  it('phase 2 modules do not include network primitives', () => {
    const files = [
      'src/track-changes.ts',
      'src/change-resolution.ts',
      'src/changes-view.ts',
      'src/quick-actions-view.ts',
      'src/theme-presets.ts',
      'src/display-mode.ts',
    ];
    const forbidden = [
      /fetch\(/,
      /XMLHttpRequest/,
      /https?:\/\//,
      /WebSocket/,
      /navigator\.sendBeacon/,
    ];

    for (const file of files) {
      const content = readFileSync(resolve(file), 'utf8');
      for (const pattern of forbidden) {
        expect(content).not.toMatch(pattern);
      }
    }
  });
});
