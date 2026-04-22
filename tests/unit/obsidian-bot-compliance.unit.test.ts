import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string): string {
  return readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');
}

type AllowlistEntry = {
  path: string;
  rationale: string;
  reviewBy: string;
};

type ComplianceRule = {
  id: string;
  assertion: string;
  pattern: RegExp;
  allowlist: AllowlistEntry[];
};

const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'no-async-lifecycle-without-await',
    assertion: 'Do not mark pane lifecycle methods onOpen/onClose as async without awaited work.',
    pattern: /\basync\s+(onOpen|onClose)\s*\(/g,
    allowlist: [],
  },
  {
    id: 'no-detach-leaves-on-unload',
    assertion: 'Do not detach leaves during plugin unload.',
    pattern: /detachLeavesOfType\s*\(/g,
    allowlist: [],
  },
  {
    id: 'no-inline-style-token-assignment',
    assertion: 'Do not assign static token styles directly; use classes and CSS.',
    pattern: /\.style\.(backgroundColor|color|display|textDecoration)\s*=/g,
    allowlist: [],
  },
  {
    id: 'no-manual-settings-headings',
    assertion: 'Settings headings must use Setting(...).setHeading() rather than raw heading elements.',
    pattern: /(containerEl|section)\.createEl\('h[1-6]'/g,
    allowlist: [],
  },
];

function listSourceFiles(root: string): string[] {
  const absoluteRoot = path.resolve(process.cwd(), root);
  const output: string[] = [];

  function walk(directory: string): void {
    for (const entry of readdirSync(directory)) {
      const absolutePath = path.join(directory, entry);
      const stats = statSync(absolutePath);
      if (stats.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (absolutePath.endsWith('.ts')) {
        output.push(path.relative(process.cwd(), absolutePath).replace(/\\/g, '/'));
      }
    }
  }

  walk(absoluteRoot);
  return output.sort();
}

function evaluateCompliance(relativePath: string, source: string): string[] {
  const violations: string[] = [];

  for (const rule of COMPLIANCE_RULES) {
    const matches = Array.from(source.matchAll(rule.pattern));
    if (matches.length === 0) {
      continue;
    }

    const allowed = rule.allowlist.some((entry) => entry.path === relativePath);
    if (!allowed) {
      violations.push(`${rule.id}: ${rule.assertion}`);
    }
  }

  return violations;
}

describe('obsidian bot compliance guards', () => {
  it('scans all src/**/*.ts files with local compliance guard rules', () => {
    const files = listSourceFiles('src');
    expect(files.length).toBeGreaterThan(0);

    const failures: Array<{ file: string; violations: string[] }> = [];
    for (const file of files) {
      const violations = evaluateCompliance(file, readSource(file));
      if (violations.length > 0) {
        failures.push({ file, violations });
      }
    }

    expect(failures).toEqual([]);
  });

  it('requires complete allowlist metadata when exceptions are declared', () => {
    for (const rule of COMPLIANCE_RULES) {
      for (const entry of rule.allowlist) {
        expect(entry.path).toBeTruthy();
        expect(entry.rationale).toBeTruthy();
        expect(entry.reviewBy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it('demonstrates blocking failure behavior when a prohibited pattern is reintroduced', () => {
    const regressionSnippet = `
      class ExampleView {
        async onOpen() {
          return;
        }
      }
    `;

    const violations = evaluateCompliance('src/example-view.ts', regressionSnippet);
    expect(violations.some((v) => v.startsWith('no-async-lifecycle-without-await'))).toBe(true);
  });

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
