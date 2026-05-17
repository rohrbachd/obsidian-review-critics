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
  it('keeps manifest and package versions aligned for 1.1.1', () => {
    const manifest = readJson<Manifest>('manifest.json');
    const pkg = readJson<PackageJson>('package.json');

    expect(manifest.version).toBe('1.1.1');
    expect(pkg.version).toBe('1.1.1');
  });

  it('maps release 1.1.1 to minAppVersion 1.7.2 without changing legacy entries', () => {
    const manifest = readJson<Manifest>('manifest.json');
    const versions = readJson<Record<string, string>>('versions.json');

    expect(manifest.minAppVersion).toBe('1.7.2');
    expect(versions['1.1.1']).toBe('1.7.2');
    expect(versions['1.1.0']).toBe('1.5.0');
  });
});

