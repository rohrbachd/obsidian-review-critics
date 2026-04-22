import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string): string {
  return readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
}

describe('obsidian bot compliance guards', () => {
  it('avoids async onOpen/onClose methods without await in pane views', () => {
    const files = ['src/changes-view.ts', 'src/comments-view.ts', 'src/quick-actions-view.ts'];

    for (const file of files) {
      const source = readSource(file);
      expect(source).not.toMatch(/\basync\s+onOpen\s*\(/);
      expect(source).not.toMatch(/\basync\s+onClose\s*\(/);
    }
  });

  it('does not detach custom leaves during plugin unload', () => {
    const source = readSource('src/main.ts');
    expect(source).toMatch(/onunload\(\): void \{/);
    expect(source).not.toMatch(/detachLeavesOfType\s*\(/);
  });

  it('awaits revealLeaf calls in pane activation paths', () => {
    const source = readSource('src/main.ts');
    const matches = source.match(/await this\.app\.workspace\.revealLeaf\(leaf\);/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it('uses Setting.setHeading for settings tab headings', () => {
    const source = readSource('src/main.ts');
    expect(source).not.toMatch(/containerEl\.createEl\('h2'/);
    expect(source).not.toMatch(/section\.createEl\('h3'/);
    const headingMatches = source.match(/new Setting\([^)]+\)\.setName\([^)]+\)\.setHeading\(\);/g) ?? [];
    expect(headingMatches.length).toBeGreaterThanOrEqual(3);
  });

  it('avoids direct inline style assignments in reading-view decorator', () => {
    const source = readSource('src/reading-view.ts');
    expect(source).not.toMatch(/\.style\.(backgroundColor|color|display|textDecoration)\s*=/);
  });
});
