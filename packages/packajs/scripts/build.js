import { build } from 'esbuild';

build({
  entryPoints: ['./src/cli.js'],
  outdir: './dist',
  format: 'esm',
  bundle: true,
  platform: 'node',
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})
  .catch((e) => {
    console.log(e);
    return process.exit(1);
  })
  .finally(() => console.log('Success.'));
