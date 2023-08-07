import { build } from 'esbuild';
import { readFileSync } from 'fs';
import { extname, dirname as _dirname } from 'path';

const nodeModules = new RegExp(
  /^(?:.*[\\/])?node_modules(?:\/(?!postgres-migrations).*)?$/
);

const plugin = {
  name: 'plugin',
  setup(build) {
    build.onLoad({ filter: /.*/ }, ({ path: filePath }) => {
      if (!filePath.match(nodeModules)) {
        let contents = readFileSync(filePath, 'utf8');
        const loader = extname(filePath).substring(1);
        const dirname = _dirname(filePath);
        contents = contents
          .replaceAll('__dirname', `"${dirname}"`)
          .replaceAll('__filename', `"${filePath}"`);
        return {
          contents,
          loader,
        };
      }
    });
  },
};

build({
  entryPoints: ['./src/cli.js'],
  outdir: './dist',
  format: 'esm',
  bundle: true,
  platform: 'node',
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
  plugins: [plugin],
})
  .catch((e) => {
    console.log(e);
    return process.exit(1);
  })
  .finally(() => console.log('Success.'));
