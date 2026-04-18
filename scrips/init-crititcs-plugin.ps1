param(
    [Parameter(Mandatory = $false)]
    [string]$ProjectRoot = ".\review-critic",

    [Parameter(Mandatory = $false)]
    [string]$PluginId = "review-critic",

    [Parameter(Mandatory = $false)]
    [string]$PluginName = "Review & CriticMarkup",

    [Parameter(Mandatory = $false)]
    [string]$MinAppVersion = "1.5.0",

    [Parameter(Mandatory = $false)]
    [string]$Author = "Daniel Rohrbach",

    [Parameter(Mandatory = $false)]
    [string]$AuthorUrl = "",

    [switch]$Force
)

$ErrorActionPreference = "Stop"

function Write-Step($message) {
    Write-Host "`n==> $message" -ForegroundColor Cyan
}

function Ensure-Command($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "Required command '$name' was not found in PATH."
    }
}

function Write-Utf8NoBom($path, $content) {
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
}

Write-Step "Checking prerequisites"
Ensure-Command "node"
Ensure-Command "npm"

$nodeVersion = (node --version).Trim()
$npmVersion = (npm --version).Trim()
Write-Host "Node: $nodeVersion"
Write-Host "npm:  $npmVersion"

$fullProjectRoot = [System.IO.Path]::GetFullPath($ProjectRoot)

if ((Test-Path $fullProjectRoot) -and -not $Force) {
    $existingItems = Get-ChildItem -Force -LiteralPath $fullProjectRoot -ErrorAction SilentlyContinue
    if ($existingItems -and $existingItems.Count -gt 0) {
        throw "Project folder '$fullProjectRoot' already exists and is not empty. Use -Force if you want to continue."
    }
}

Write-Step "Creating project folders"
New-Item -ItemType Directory -Force -Path $fullProjectRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $fullProjectRoot "src") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $fullProjectRoot ".github\workflows") | Out-Null

Push-Location $fullProjectRoot
try {
    Write-Step "Initializing npm project"
    npm init -y | Out-Null

    Write-Step "Installing dependencies"
    npm install obsidian | Out-Null
    npm install -D typescript esbuild @types/node builtin-modules | Out-Null

    Write-Step "Writing package.json"
    $packageJson = @"
{
  "name": "$PluginId",
  "version": "0.1.0",
  "description": "Obsidian plugin for review comments and CriticMarkup-inspired editing.",
  "main": "main.js",
  "scripts": {
    "build": "node esbuild.config.mjs production",
    "dev": "node esbuild.config.mjs",
    "check": "tsc --noEmit"
  },
  "keywords": [
    "obsidian",
    "obsidian-plugin",
    "criticmarkup",
    "review"
  ],
  "author": "$Author",
  "license": "MIT",
  "dependencies": {
    "obsidian": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "builtin-modules": "latest",
    "esbuild": "latest",
    "typescript": "latest"
  }
}
"@
    Write-Utf8NoBom (Join-Path $fullProjectRoot "package.json") $packageJson

    Write-Step "Writing TypeScript config"
    $tsconfigJson = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "ES2020"],
    "strict": true,
    "sourceMap": true,
    "inlineSources": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"],
    "baseUrl": ".",
    "outDir": "."
  },
  "include": ["src/**/*.ts"]
}
"@
    Write-Utf8NoBom (Join-Path $fullProjectRoot "tsconfig.json") $tsconfigJson

    Write-Step "Writing esbuild config"
    $esbuildConfig = @"
import esbuild from 'esbuild';
import process from 'node:process';
import builtins from 'builtin-modules';

const banner = `/* Bundled for Obsidian */`;
const prod = process.argv.includes('production');
const watch = !prod;

const context = await esbuild.context({
  banner: { js: banner },
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'electron', ...builtins],
  format: 'cjs',
  target: 'es2020',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
  logLevel: 'info'
});

if (watch) {
  await context.watch();
  console.log('Watching for changes...');
} else {
  await context.rebuild();
  await context.dispose();
  console.log('Build complete.');
}
"@
    Write-Utf8NoBom (Join-Path $fullProjectRoot "esbuild.config.mjs") $esbuildConfig

    Write-Step "Writing manifest and version mapping"
    $manifestJson = @"
{
  "id": "$PluginId",
  "name": "$PluginName",
  "version": "0.1.0",
  "minAppVersion": "$MinAppVersion",
  "description": "Review and CriticMarkup-style comments for Obsidian.",
  "author": "$Author",
  "authorUrl": "$AuthorUrl",
  "isDesktopOnly": false
}
"@
    Write-Utf8NoBom (Join-Path $fullProjectRoot "manifest.json") $manifestJson

    $versionsJson = @"
{
  "0.1.0": "$MinAppVersion"
}
"@
    Write-Utf8NoBom (Join-Path $fullProjectRoot "versions.json") $versionsJson

    Write-Step "Writing starter files"
    $stylesCss = @"
.review-comment-badge {
  display: inline-block;
  padding: 0 0.4rem;
  border-radius: 999px;
  font-size: 0.75rem;
  line-height: 1.6;
  border: 1px solid var(--background-modifier-border);
}

.review-highlight {
  background-color: var(--text-highlight-bg);
}
"@
    Write-Utf8NoBom (Join-Path $fullProjectRoot "styles.css") $stylesCss

    $mainTs = @'
import { Notice, Plugin, PluginSettingTab, Setting, App } from 'obsidian';

interface ReviewPluginSettings {
  authorName: string;
  enableReadingView: boolean;
  enableLivePreview: boolean;
}

const DEFAULT_SETTINGS: ReviewPluginSettings = {
  authorName: '__AUTHOR__',
  enableReadingView: true,
  enableLivePreview: true,
};

export default class ReviewPlugin extends Plugin {
  settings!: ReviewPluginSettings;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.addCommand({
      id: 'insert-review-comment',
      name: 'Insert review comment',
      editorCallback: (editor) => {
        const author = this.settings.authorName?.trim();
        const markup = author
          ? `{>> [author=${author}]  <<}`
          : `{>>  <<}`;

        editor.replaceSelection(markup);
        new Notice('Inserted review comment');
      },
    });

    this.addCommand({
      id: 'add-comment-to-selection',
      name: 'Add comment to selection',
      editorCallback: (editor) => {
        const selection = editor.getSelection();
        if (!selection) {
          new Notice('Select some text first.');
          return;
        }

        const author = this.settings.authorName?.trim();
        const comment = author
          ? `{>> [author=${author}]  <<}`
          : `{>>  <<}`;

        editor.replaceSelection(`{==${selection}==}${comment}`);
        new Notice('Inserted anchored comment');
      },
    });

    this.addSettingTab(new ReviewSettingTab(this.app, this));

    new Notice('Review plugin loaded');
  }

  onunload(): void {
    console.log('Review plugin unloaded');
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}

class ReviewSettingTab extends PluginSettingTab {
  plugin: ReviewPlugin;

  constructor(app: App, plugin: ReviewPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Review & CriticMarkup settings' });

    new Setting(containerEl)
      .setName('Author name')
      .setDesc('Default author inserted into comments.')
      .addText((text) =>
        text
          .setPlaceholder('Your name')
          .setValue(this.plugin.settings.authorName)
          .onChange(async (value) => {
            this.plugin.settings.authorName = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Enable Reading view rendering')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableReadingView)
          .onChange(async (value) => {
            this.plugin.settings.enableReadingView = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Enable Live Preview rendering')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableLivePreview)
          .onChange(async (value) => {
            this.plugin.settings.enableLivePreview = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
'@
    $mainTs = $mainTs.Replace('__AUTHOR__', $Author)
    Write-Utf8NoBom (Join-Path $fullProjectRoot "src\main.ts") $mainTs

    $gitignore = @"
node_modules/
*.log
"@
    Write-Utf8NoBom (Join-Path $fullProjectRoot ".gitignore") $gitignore

    $readme = @"
# $PluginName

Obsidian plugin scaffold for review comments and CriticMarkup-inspired editing.

## Development

```powershell
npm install
npm run dev
```

The compiled plugin files are written into this folder as:
- main.js
- manifest.json
- styles.css

If this project folder lives under:

```text
<Vault>/.obsidian/plugins/$PluginId
```

then Obsidian can load it directly as a community plugin during development.
"@
    Write-Utf8NoBom (Join-Path $fullProjectRoot "README.md") $readme

    Write-Step "Running initial type check"
    npm run check | Out-Null

    Write-Host "`nProject initialized successfully." -ForegroundColor Green
    Write-Host "Location: $fullProjectRoot"
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "  1. cd '$fullProjectRoot'"
    Write-Host "  2. npm run dev"
    Write-Host "  3. In Obsidian, reload the app and enable the plugin"
    Write-Host "`nTip: For the smoothest workflow, place this project directly inside your vault at:"
    Write-Host "  <Vault>/.obsidian/plugins/$PluginId"
}
finally {
    Pop-Location
}
