import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const releaseWorkflowPath = path.resolve(process.cwd(), '.github/workflows/release.yml');

describe('release workflow contract', () => {
  it('defines a dedicated release workflow file', () => {
    expect(existsSync(releaseWorkflowPath)).toBe(true);
  });

  it('includes attest and release-publish gate expectations', () => {
    const content = readFileSync(releaseWorkflowPath, 'utf8');
    expect(content).toContain('tags:');
    expect(content).toContain("'*.*.*'");
    expect(content).toContain('attestations: write');
    expect(content).toContain('npm run release:check -- ${{ github.ref_name }}');
    expect(content).toContain('actions/attest@v4');
    expect(content).toContain('subject-path:');
    expect(content).toContain('main.js');
    expect(content).toContain('manifest.json');
    expect(content).toContain('styles.css');
    expect(content).toContain('gh release create');
  });

  it('attests and publishes the required provenance assets', () => {
    const content = readFileSync(releaseWorkflowPath, 'utf8');
    expect(content).toMatch(/uses:\s*actions\/attest@v4/);
    expect(content).toMatch(/subject-path:\s*\|[\s\S]*main\.js/);
    expect(content).toMatch(/subject-path:\s*\|[\s\S]*styles\.css/);
    expect(content).toMatch(
      /gh release create[\s\S]*main\.js[\s\S]*manifest\.json[\s\S]*styles\.css/
    );
  });
});
