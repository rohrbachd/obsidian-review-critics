import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function readJson<T>(relativePath: string): T {
  const absolute = path.resolve(process.cwd(), relativePath);
  return JSON.parse(readFileSync(absolute, 'utf8')) as T;
}

type Manifest = {
  version: string;
  minAppVersion: string;
};

type PackageJson = {
  version: string;
};

describe('release metadata consistency', () => {
  it('keeps manifest and package versions aligned for the active release version', () => {
    const manifest = readJson<Manifest>('manifest.json');
    const pkg = readJson<PackageJson>('package.json');

    expect(manifest.version).toBeTruthy();
    expect(pkg.version).toBeTruthy();
    expect(pkg.version).toBe(manifest.version);
  });

  it('maps the active release to minAppVersion and preserves legacy compatibility entries', () => {
    const manifest = readJson<Manifest>('manifest.json');
    const versions = readJson<Record<string, string>>('versions.json');

    expect(manifest.minAppVersion).toBe('1.7.2');
    expect(versions[manifest.version]).toBe('1.7.2');
    expect(versions['1.1.0']).toBe('1.5.0');
  });

  it('keeps release-check required asset list aligned to provenance expectations', () => {
    const releaseCheckSource = readFileSync(
      path.resolve(process.cwd(), 'scripts/check-obsidian-release.mjs'),
      'utf8'
    );

    expect(releaseCheckSource).toContain(
      "const requiredAssets = ['manifest.json', 'main.js', 'styles.css']"
    );
    expect(releaseCheckSource).toContain(
      "const requiredAttestedAssets = ['main.js', 'styles.css']"
    );
  });
});
