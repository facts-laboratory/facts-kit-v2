import Async, {
  Rejected,
  Resolved,
  fromPromise,
} from '../common/hyper-async.js';
import { promises } from 'fs';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';
import chalk from 'chalk';

/**
 * @typedef {Object} PublishOptions
 * @property {string} arns - The ARNs (Amazon Resource Names) associated with the file.
 * @property {string} path - The path where the JavaScript file will be published.
 * @property {string} wallet - The path to the wallet
 * @property {Array<string>} tag - An array of tags to attach to the published file.
 * @property {Array<{name: string; value: string}>} [tags] - An array of tags to attach to the published file.
 * @property {string} file - The content of the JavaScript file to be published.
 */

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} bundlr
 */
export function pubjs(bundlr) {
  /**
   * Publishes a file to the permaweb.
   * @param {PublishOptions} options The options for publishing the JavaScript file.
   */
  return async (options) =>
    Async.of(options)
      .chain(fromPromise(validateInput))
      .chain(fromPromise(getFile))
      .chain((options) => fromPromise(publish)(bundlr, options))
      .fork(
        (error) => {
          console.error(
            chalk.red(error?.message || error || 'An error occurred.')
          );
          process.exit();
        },
        (output) => {
          return output;
        }
      );
}

/**
 * Validates the input.
 * @param {PublishOptions} options - The options for publishing the JavaScript file.
 */
const validateInput = async (options) => {
  return Async.of(options)
    .chain(hasOptions)
    .chain(hasWallet)
    .chain(fromPromise(validateArns))
    .chain((options) => validateTags(options.tag))
    .map((tags) => ({
      ...options,
      tags,
    }))
    .toPromise();
};

const hasOptions = (options) => {
  if (!options) return Rejected('There were no options passed to the command.');
  return Resolved(options);
};

const hasWallet = (options) => {
  if (!options?.wallet)
    return Rejected(
      'Please pass a wallet file to the command. eg. -w /path/to/wallet.json'
    );
  return Resolved(options);
};

const validateArns = async (options) => {
  console.log(
    chalk.yellow('Validating arns: '),
    options.arns || '<missing arns option>'
  );
  // Make sure the wallet being used owns or controls the ARNS name being updated.
  return options;
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
async function publish(bundlr, options) {
  console.log(chalk.yellow('Uploading package to bundlr.'));
  const response = await bundlr.uploadFile(options.file, {
    tags: options.tags || [],
  });
  console.log(
    `${chalk.green('File uploaded')} ==> ${chalk.underline(
      `https://arweave.net/${response.id}`
    )}`
  );

  return options;
}
