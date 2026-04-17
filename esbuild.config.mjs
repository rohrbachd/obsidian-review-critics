import esbuild from 'esbuild';
import process from 'node:process';
import builtins from 'builtin-modules';

const banner = '/* Bundled for Obsidian */';
const prod = process.argv.includes('production');
const watch = !prod;

const context = await esbuild.context({
  banner: { js: banner },
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: [
    'obsidian',
    'electron',
    '@codemirror/state',
    '@codemirror/view',
    '@codemirror/language',
    '@codemirror/commands',
    '@codemirror/search',
    '@codemirror/autocomplete',
    '@lezer/common',
    ...builtins,
  ],
  format: 'cjs',
  target: 'es2020',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
  logLevel: 'info',
});

if (watch) {
  await context.watch();
  console.log('Watching for changes...');
} else {
  await context.rebuild();
  await context.dispose();
  console.log('Build complete.');
}
