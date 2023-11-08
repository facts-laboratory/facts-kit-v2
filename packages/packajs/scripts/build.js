import { build } from "esbuild";
import replace from "replace-in-file";

build({
  entryPoints: ["./src/cli.js"],
  outdir: "./dist",
  format: "esm",
  bundle: true,
  platform: "node",
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);import { fileURLToPath } from 'url';import { dirname } from 'path';const __filename = fileURLToPath(import.meta.url);const __dirname = dirname(__filename);`,
  },
})
  .then(() =>
    replace.sync({
      files: "./dist/cli.js",
      from: [
        `console.warn("bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)");`,
      ],
      to: "",
      countMatches: true,
    })
  )
  .catch((e) => {
    console.log(e);
    return process.exit(1);
  })
  .finally(() => console.log("Success."));
