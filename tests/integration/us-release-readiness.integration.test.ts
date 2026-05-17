import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('release readiness integration', () => {
  it('passes release metadata validation for 1.1.1', () => {
    const script = path.resolve(process.cwd(), 'scripts/check-obsidian-release.mjs');
    const result = spawnSync(process.execPath, [script, '1.1.1'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('[release-check] OK');
  });

  it('defines required provenance assets in the release workflow', () => {
    const workflow = readFileSync(
      path.resolve(process.cwd(), '.github/workflows/release.yml'),
      'utf8'
    );
    expect(workflow).toContain('actions/attest@v4');
    expect(workflow).toContain('main.js');
    expect(workflow).toContain('manifest.json');
    expect(workflow).toContain('styles.css');
  });
});
