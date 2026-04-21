import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, 'manifest.json');
const releaseAssets = ['manifest.json', 'main.js', 'styles.css'];

function fail(message) {
  console.error(`[release-publish] ${message}`);
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

function commandSucceeds(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'ignore',
    shell: false,
  });
  return result.status === 0;
}

function readManifestVersion() {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (!manifest.version || typeof manifest.version !== 'string') {
      fail('manifest.json has no valid string "version".');
    }
    return manifest.version;
  } catch (error) {
    fail(`Could not read manifest.json: ${String(error)}`);
  }
}

function getCurrentBranch() {
  const result = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { capture: true });
  return (result.stdout || '').trim();
}

function assertCleanWorkingTree() {
  const result = run('git', ['status', '--porcelain'], { capture: true });
  const dirty = (result.stdout || '').trim();
  if (dirty.length > 0) {
    fail('Working tree is not clean. Commit/stash changes before publishing a release.');
  }
}

function assertGhReady() {
  if (!commandSucceeds('gh', ['--version'])) {
    fail('GitHub CLI is not installed. Install from https://cli.github.com/');
  }

  if (!commandSucceeds('gh', ['auth', 'status'])) {
    fail('GitHub CLI is not authenticated. Run "gh auth login" first.');
  }
}

function assertTagDoesNotExist(tag) {
  if (commandSucceeds('git', ['rev-parse', '--verify', `refs/tags/${tag}`])) {
    fail(`Tag "${tag}" already exists locally.`);
  }

  const remoteResult = spawnSync('git', ['ls-remote', '--tags', 'origin', tag], {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: false,
  });

  if (remoteResult.error) {
    fail(`Could not verify remote tags: ${String(remoteResult.error)}`);
  }
  if (remoteResult.status !== 0) {
    fail(`Could not verify remote tags for "${tag}".`);
  }
  if ((remoteResult.stdout || '').trim().length > 0) {
    fail(`Tag "${tag}" already exists on origin.`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const skipBuild = args.includes('--skip-build');
  const skipBranchPush = args.includes('--skip-branch-push');
  const versionArg = args.find((arg) => !arg.startsWith('--'));
  const manifestVersion = readManifestVersion();
  const releaseVersion = versionArg || manifestVersion;

  if (releaseVersion !== manifestVersion) {
    fail(
      `Provided version "${releaseVersion}" does not match manifest.json version "${manifestVersion}".`
    );
  }
  if (releaseVersion.startsWith('v')) {
    fail(`Use release tag "${manifestVersion}" without a leading "v".`);
  }

  assertGhReady();
  assertCleanWorkingTree();
  assertTagDoesNotExist(releaseVersion);

  if (!skipBuild) {
    console.log(`[release-publish] Building ${releaseVersion}...`);
    run(process.execPath, ['esbuild.config.mjs', 'production']);
  } else {
    console.log('[release-publish] Skipping build (--skip-build).');
  }

  console.log(`[release-publish] Validating release assets and version mapping...`);
  run(process.execPath, ['scripts/check-obsidian-release.mjs', releaseVersion]);

  assertCleanWorkingTree();

  const branch = getCurrentBranch();
  if (!branch || branch === 'HEAD') {
    fail('Could not determine current branch.');
  }

  if (!skipBranchPush) {
    console.log(`[release-publish] Pushing branch "${branch}" to origin...`);
    run('git', ['push', 'origin', branch]);
  } else {
    console.log('[release-publish] Skipping branch push (--skip-branch-push).');
  }

  console.log(`[release-publish] Creating and pushing tag "${releaseVersion}"...`);
  run('git', ['tag', '-a', releaseVersion, '-m', `Release ${releaseVersion}`]);
  run('git', ['push', 'origin', releaseVersion]);

  console.log(`[release-publish] Creating GitHub release "${releaseVersion}" with assets...`);
  run('gh', [
    'release',
    'create',
    releaseVersion,
    ...releaseAssets,
    '--title',
    releaseVersion,
    '--generate-notes',
    '--verify-tag',
  ]);

  console.log(
    `[release-publish] Done. Release published: https://github.com/rohrbachd/obsidian-review-critics/releases/tag/${releaseVersion}`
  );
}

main();
