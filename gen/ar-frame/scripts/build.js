const { build } = require('esbuild');

const options = {
  entryPoints: ['src/App.jsx'],
  bundle: true,
  outfile: 'dist/app.js',
  format: 'cjs',
  platform: 'node',
  external: ['react', 'react-dom'],
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
};

build(options)
  .then((o) => {
    console.log('Build completed successfully!', o);
  })
  .catch((error) => {
    console.error('Build failed:', error.message);
    process.exit(1);
  });
