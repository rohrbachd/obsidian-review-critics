import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, 'manifest.json');
const packageJsonPath = path.join(repoRoot, 'package.json');
const versionsPath = path.join(repoRoot, 'versions.json');
const requiredAssets = ['manifest.json', 'main.js', 'styles.css'];
const SEMVER_TAG_PATTERN = /^\d+\.\d+\.\d+$/;

function fail(message) {
  console.error(`[release-check] ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.basename(filePath)}`);
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in ${path.basename(filePath)}: ${String(error)}`);
  }
}

const manifest = readJson(manifestPath);
const packageJson = readJson(packageJsonPath);
const versions = readJson(versionsPath);
const tagFromArg = process.argv[2];
const tagFromCi =
  process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_TAG || process.env.TAG_NAME || '';
const releaseTag = tagFromArg || tagFromCi;

if (!manifest.version || typeof manifest.version !== 'string') {
  fail('manifest.json must contain a string "version" value.');
}

if (!manifest.minAppVersion || typeof manifest.minAppVersion !== 'string') {
  fail('manifest.json must contain a string "minAppVersion" value.');
}

if (!packageJson.version || typeof packageJson.version !== 'string') {
  fail('package.json must contain a string "version" value.');
}

if (packageJson.version !== manifest.version) {
  fail(
    `package.json version "${packageJson.version}" must match manifest version "${manifest.version}".`
  );
}

if (versions[manifest.version] !== manifest.minAppVersion) {
  fail(
    `versions.json must contain "${manifest.version}": "${manifest.minAppVersion}" to match manifest.json.`
  );
}

for (const asset of requiredAssets) {
  const absoluteAssetPath = path.join(repoRoot, asset);
  if (!fs.existsSync(absoluteAssetPath)) {
    fail(`Required release asset is missing: ${asset}`);
  }

  const stats = fs.statSync(absoluteAssetPath);
  if (!stats.isFile() || stats.size === 0) {
    fail(`Required release asset is empty or invalid: ${asset}`);
  }
}

if (releaseTag) {
  if (!SEMVER_TAG_PATTERN.test(releaseTag)) {
    fail(`Release tag "${releaseTag}" is invalid. Use x.y.z semantic version tags without prefix.`);
  }

  if (releaseTag !== manifest.version) {
    fail(`Release tag "${releaseTag}" does not match manifest version "${manifest.version}".`);
  }
}

console.log(
  `[release-check] OK: version=${manifest.version}, minAppVersion=${manifest.minAppVersion}, assets=${requiredAssets.join(', ')}`
);
