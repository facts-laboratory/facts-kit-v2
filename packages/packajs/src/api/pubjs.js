import Async, {
  Rejected,
  Resolved,
  fromPromise,
} from '../common/hyper-async.js';
import { promises } from 'fs';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';
import chalk from 'chalk';
import {
  getConfigAndManifest,
  hasOptions,
  hasWallet,
  validateArns,
} from '../common/util.js';

/**
 * @typedef {Object} PublishOptions
 * @property {string} arns - The ARNs (Amazon Resource Names) associated with the file.
 * @property {string} path - The path where the JavaScript file will be published.
 * @property {string} wallet - The path to the wallet
 * @property {Array<string>} tag - An array of tags to attach to the published file.
 * @property {Array<{name: string; value: string}>} [tags] - An array of tags to attach to the published file.
 * @property {string} file - The content of the JavaScript file to be published.
 * @property {*} [manifest] - The content of the JavaScript file to be published.
 * @property {*} [config] - The content of the JavaScript file to be published.
 * @property {string} [tx] - The content of the JavaScript file to be published.
 */

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} options
 */
export function pubjs({ bundlr, promises, version }) {
  /**
   * Publishes a file to the permaweb.
   * @param {PublishOptions} options The options for publishing the JavaScript file.
   */
  return async (options) =>
    Async.of(promises)
      .chain(fromPromise(getConfigAndManifest))
      .chain((config) => fromPromise(validateInput)(options, config))
      .chain(fromPromise(getFile))
      .chain((/** @type {PublishOptions} */ options) =>
        fromPromise(publishPackage)(bundlr, options)
      )
      .chain((options) =>
        fromPromise(createManifest)(promises, options, version)
      )
      .chain((manifest) => fromPromise(publishManifest)(bundlr, manifest))
      .fork(
        (error) => {
          if (error?.message?.includes('config.json')) {
            console.error(
              chalk.red('Config not found. Please run the `init` function.')
            );
            process.exit();
          }
          console.error(
            chalk.red(error?.message || error || 'An error occurred.')
          );
          process.exit();
        },
        () => {
          console.log(chalk.green('Success'));
        }
      );
}

/**
 * Validates the input.
 * @param {PublishOptions} options - The options for publishing the JavaScript file.
 * @param {*} config - The packajs config
 */
const validateInput = async (options, config) => {
  return Async.of(options)
    .chain(hasOptions)
    .chain(hasWallet)
    .chain(fromPromise(validateArns))
    .chain((options) => validateTags(options.tag))
    .map((tags) => ({
      ...options,
      tags,
      ...config,
    }))
    .toPromise();
};

const validateTags = (tags) => {
  for (const t of tags) {
    const kv = t.split('=');
    if (kv.length !== 2) {
      return Rejected(
        `Invalid tag "${t}". A valid tag is -t key=value or --tag key=value.`
      );
    }
  }
  const packajsTags = [
    { name: 'Data-Protocol', value: 'Permanent-Package' },
    { name: 'Programming-Lang', value: 'javascript' },
  ];
  return Resolved([
    ...tags.map((t) => {
      const kv = t.split('=');
      return {
        name: kv[0],
        value: kv[1],
      };
    }),
    ...packajsTags,
  ]);
};

async function getFile(options) {
  if (options.file) {
    return options;
  }
  return promises
    .readdir('./dist')
    .then((files) => {
      const tgz = files.filter((f) => f.includes('.tgz'))[0];
      if (!tgz)
        throw new Error(
          'There is no .tgz file to publish in the ./dist folder. Run npm pack in your dist folder.\n\nOptionally, you can pass a file path to publish directly to the command using -f /path/to/file.'
        );

      return { ...options, file: `./dist/${tgz}` };
    })
    .catch((err) => {
      throw new Error(err.message || 'An error occurred.');
    });
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {NodeBundlr} bundlr
 * @param {PublishOptions} options The options for publishing the JavaScript file.
 *
 */
async function publishPackage(bundlr, options) {
  console.log(chalk.yellow('Uploading package.'));
  const response = await bundlr.uploadFile(options.file, {
    tags: options.tags || [],
  });
  console.log(
    `${chalk.green('Package uploaded')} ==> ${chalk.underline(
      `https://arweave.net/${response.id}`
    )}`
  );

  return { ...options, tx: response.id };
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 * @param {PublishOptions} options The options for publishing the JavaScript file.
 * @param {string} version The package.json version.
 *
 */
async function createManifest(promises, options, version) {
  console.log(chalk.yellow('Creating new manifest.'));
  const manifest = JSON.parse(options.manifest);
  const newManifest = {
    ...manifest,
    paths: {
      ...manifest.paths,
      latest: {
        id: options.tx,
      },
      [version]: {
        id: options.tx,
      },
    },
  };

  await promises.writeFile(
    './.packajs/manifest.json',
    JSON.stringify(newManifest, null, 2)
  );

  return newManifest;
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {NodeBundlr} bundlr
 * @param {*} manifest The new manifest.
 *
 */
async function publishManifest(bundlr, manifest) {
  console.log(chalk.yellow('Uploading manifest.'));

  const tags = [
    { name: 'Content-Type', value: 'application/x.arweave-manifest+json' },
  ];

  const response = await bundlr.upload(JSON.stringify(manifest), {
    tags,
  });
  console.log(
    `${chalk.green('Manifest uploaded')} ==> ${chalk.underline(
      `https://arweave.net/${response.id}`
    )}`
  );
}
