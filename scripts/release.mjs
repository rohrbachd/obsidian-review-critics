import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, 'manifest.json');
const versionsPath = path.join(repoRoot, 'versions.json');
const packagePath = path.join(repoRoot, 'package.json');
const ALLOWED_TYPES = new Set(['patch', 'minor', 'major']);

function fail(message) {
  console.error(`[release-auto] ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: options.capture ? ['inherit', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
    shell: false,
  });

  if (result.error) {
    fail(`Failed to run "${command} ${args.join(' ')}": ${String(result.error)}`);
  }

  if (result.status !== 0) {
    if (options.capture) {
      const stderr = (result.stderr || '').trim();
      const stdout = (result.stdout || '').trim();
      const detail = stderr || stdout || `exit code ${result.status}`;
      fail(`Command failed: ${command} ${args.join(' ')}\n${detail}`);
    }
    process.exit(result.status ?? 1);
  }

  return result;
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Could not read ${path.basename(filePath)}: ${String(error)}`);
  }
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function parseSemver(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    fail(`Invalid semver "${version}". Expected format: x.y.z`);
  }

  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
  };
}

function bumpVersion(currentVersion, releaseType) {
  const parsed = parseSemver(currentVersion);

  if (releaseType === 'patch') {
    return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
  }
  if (releaseType === 'minor') {
    return `${parsed.major}.${parsed.minor + 1}.0`;
  }
  if (releaseType === 'major') {
    return `${parsed.major + 1}.0.0`;
  }

  fail(`Unsupported release type "${releaseType}".`);
}

function assertOnMain() {
  const branchResult = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { capture: true });
  const branch = (branchResult.stdout || '').trim();
  if (branch !== 'main') {
    fail(`Releases must be created from "main". Current branch is "${branch}".`);
  }
}

function assertCleanWorkingTree() {
  const result = run('git', ['status', '--porcelain'], { capture: true });
  if ((result.stdout || '').trim().length > 0) {
    fail('Working tree is not clean. Commit or stash local changes first.');
  }
}

function main() {
  const releaseType = process.argv[2];
  if (!releaseType || !ALLOWED_TYPES.has(releaseType)) {
    fail('Usage: node scripts/release.mjs <patch|minor|major>');
  }

  assertOnMain();
  assertCleanWorkingTree();

  const manifest = readJson(manifestPath);
  const versions = readJson(versionsPath);
  const packageJson = readJson(packagePath);

  if (!manifest.version || typeof manifest.version !== 'string') {
    fail('manifest.json must contain a string "version".');
  }
  if (!manifest.minAppVersion || typeof manifest.minAppVersion !== 'string') {
    fail('manifest.json must contain a string "minAppVersion".');
  }

  const nextVersion = bumpVersion(manifest.version, releaseType);

  manifest.version = nextVersion;
  packageJson.version = nextVersion;
  versions[nextVersion] = manifest.minAppVersion;

  writeJson(manifestPath, manifest);
  writeJson(versionsPath, versions);
  writeJson(packagePath, packageJson);

  console.log(`[release-auto] Version bumped: ${manifest.version} -> ${nextVersion} (${releaseType})`);
  run('git', ['add', 'manifest.json', 'versions.json', 'package.json']);
  run('git', ['commit', '-m', `release: ${nextVersion}`]);

  console.log(`[release-auto] Publishing ${nextVersion}...`);
  run('npm', ['run', 'release:publish:version', '--', nextVersion]);

  console.log(`[release-auto] Done: ${nextVersion}`);
}

main();
