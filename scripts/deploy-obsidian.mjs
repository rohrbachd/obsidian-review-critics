import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const PLUGIN_ID = 'review-critic';
const REQUIRED_FILES = ['main.js', 'manifest.json', 'styles.css'];

function resolveVaultPath() {
  const argPath = process.argv[2];
  const envPath = process.env.OBSIDIAN_VAULT_PATH;
  const vaultPath = argPath || envPath;

  if (!vaultPath) {
    throw new Error('Vault path missing. Pass it as first argument or set OBSIDIAN_VAULT_PATH.');
  }

  return path.resolve(vaultPath);
}

function assertRequiredBuildFiles(repoRoot) {
  const missing = REQUIRED_FILES.filter((fileName) => !existsSync(path.join(repoRoot, fileName)));

  if (missing.length > 0) {
    throw new Error(`Missing build artifacts: ${missing.join(', ')}. Run "npm run build" first.`);
  }
}

function deployFiles(repoRoot, vaultPath) {
  const destinationDir = path.join(vaultPath, '.obsidian', 'plugins', PLUGIN_ID);
  mkdirSync(destinationDir, { recursive: true });

  for (const fileName of REQUIRED_FILES) {
    const source = path.join(repoRoot, fileName);
    const destination = path.join(destinationDir, fileName);
    copyFileSync(source, destination);
  }

  return destinationDir;
}

function main() {
  const repoRoot = process.cwd();
  const vaultPath = resolveVaultPath();

  assertRequiredBuildFiles(repoRoot);
  const destinationDir = deployFiles(repoRoot, vaultPath);

  console.log(`Deployed ${PLUGIN_ID} to: ${destinationDir}`);
  console.log(`Copied files: ${REQUIRED_FILES.join(', ')}`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Deploy failed: ${message}`);
  process.exit(1);
}
