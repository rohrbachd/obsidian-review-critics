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

function runMaybe(command, args) {
  return spawnSync(command, args, {
    cwd: repoRoot,
    stdio: ['inherit', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: false,
  });
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

function compareSemver(left, right) {
  const a = parseSemver(left);
  const b = parseSemver(right);

  if (a.major !== b.major) {
    return a.major - b.major;
  }
  if (a.minor !== b.minor) {
    return a.minor - b.minor;
  }
  return a.patch - b.patch;
}

function ensureGhReady() {
  const ghVersion = runMaybe('gh', ['--version']);
  if (ghVersion.error || ghVersion.status !== 0) {
    fail('GitHub CLI is required. Install it and run "gh auth login".');
  }

  const ghAuth = runMaybe('gh', ['auth', 'status']);
  if (ghAuth.error || ghAuth.status !== 0) {
    fail('GitHub CLI is not authenticated. Run "gh auth login" first.');
  }
}

function getLatestPublishedVersion() {
  const repoResult = runMaybe('gh', [
    'repo',
    'view',
    '--json',
    'nameWithOwner',
    '--jq',
    '.nameWithOwner',
  ]);
  if (repoResult.error || repoResult.status !== 0) {
    const detail = (repoResult.stderr || repoResult.stdout || '').trim();
    fail(`Could not resolve GitHub repository for this folder. ${detail}`);
  }

  const nameWithOwner = (repoResult.stdout || '').trim();
  if (!nameWithOwner) {
    fail('Could not resolve GitHub repository name (owner/repo).');
  }

  const latestResult = runMaybe('gh', [
    'api',
    `repos/${nameWithOwner}/releases/latest`,
    '--jq',
    '.tag_name',
  ]);

  if (latestResult.error) {
    fail(`Failed to query latest release: ${String(latestResult.error)}`);
  }

  if (latestResult.status !== 0) {
    const detail = ((latestResult.stderr || latestResult.stdout || '') + '').trim();
    if (detail.includes('404') || detail.toLowerCase().includes('not found')) {
      return null;
    }
    fail(`Could not query latest release: ${detail}`);
  }

  const rawTag = (latestResult.stdout || '').trim();
  if (!rawTag) {
    return null;
  }

  const normalized = rawTag.startsWith('v') ? rawTag.slice(1) : rawTag;
  parseSemver(normalized);
  return normalized;
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

  ensureGhReady();
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

  const currentManifestVersion = manifest.version;
  const latestPublishedVersion = getLatestPublishedVersion();
  const baseVersion =
    latestPublishedVersion && compareSemver(latestPublishedVersion, currentManifestVersion) > 0
      ? latestPublishedVersion
      : currentManifestVersion;
  const nextVersion = bumpVersion(baseVersion, releaseType);

  manifest.version = nextVersion;
  packageJson.version = nextVersion;
  versions[nextVersion] = manifest.minAppVersion;

  writeJson(manifestPath, manifest);
  writeJson(versionsPath, versions);
  writeJson(packagePath, packageJson);

  console.log(
    `[release-auto] Version target: base=${baseVersion}, manifest(before)=${currentManifestVersion}, next=${nextVersion} (${releaseType})`
  );
  run('git', ['add', 'manifest.json', 'versions.json', 'package.json']);

  const stagedDiff = runMaybe('git', [
    'diff',
    '--cached',
    '--quiet',
    '--',
    'manifest.json',
    'versions.json',
    'package.json',
  ]);

  if (stagedDiff.error) {
    fail(`Failed checking staged diff: ${String(stagedDiff.error)}`);
  }

  if (stagedDiff.status !== 0) {
    run('git', ['commit', '-m', `release: ${nextVersion}`]);
  } else {
    console.log(
      `[release-auto] Version files already set for ${nextVersion}; skipping bump commit.`
    );
  }

  console.log(`[release-auto] Publishing ${nextVersion}...`);
  run(process.execPath, ['scripts/publish-github-release.mjs', nextVersion]);

  console.log(`[release-auto] Done: ${nextVersion}`);
}

main();
