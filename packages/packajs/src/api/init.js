import chalk from 'chalk';
import { DEFUULT_CONFIG, DEFUULT_MANIFEST } from '../common/constants.js';
import Async, {
  Rejected,
  Resolved,
  fromPromise,
} from '../common/hyper-async.js';
import { getFile } from '../common/util.js';

/**
 * Initializes the module with custom promises.
 *
 * @typedef {Object} PromiseModule
 * @property {typeof import('fs').promises} promises - The custom promises module.
 */

/**
 * Initialize the module.
 *
 * @param {PromiseModule} options - The options for initialization.
 */
export function init({ promises }) {
  /**
   * 1. Create Config File
   * 2. Create Manifest File
   */
  return async () => {
    return Async.of(promises)
      .chain((promises) =>
        fromPromise(getFile)(promises, './.packajs/config.json')
      )
      .bichain(() => fromPromise(createConfig)(promises), exists)
      .fork(
        (e) => {
          console.error(chalk.red(e?.message || e || 'An error occurred.'));
          process.exit();
        },
        () => {
          console.log(chalk.green('Project initialized.'));
        }
      );
  };
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 */
async function createConfig(promises) {
  await promises.mkdir('./.packajs');
  console.log(chalk.yellow('.packajs directory created.'));
  await promises.writeFile(
    './.packajs/config.json',
    JSON.stringify(DEFUULT_CONFIG)
  );
  console.log(chalk.yellow('.packajs/config.json created.'));

  await promises.writeFile(
    './.packajs/manifest.json',
    JSON.stringify(DEFUULT_MANIFEST)
  );
  console.log(chalk.yellow('.packajs/manifest.json created.'));
}

function exists(input) {
  console.log(chalk.green(input));
  return Rejected('Project already initialized.');
}
