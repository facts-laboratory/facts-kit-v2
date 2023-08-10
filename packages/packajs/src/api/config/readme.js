import Async, {
  Rejected,
  Resolved,
  fromPromise,
} from '../../common/hyper-async.js';
import chalk from 'chalk';
import { getFile, isTx } from '../../common/util.js';
import fetch from 'node-fetch';

/**
 *
 *
 * @author @jshaw-ar
 * @export
 */
export function upload({ promises, bundlr }) {
  /**
   * Sets the ant.tx in the config.
   */
  return async () => {
    return Async.of(undefined)
      .chain(() => fromPromise(getFile)(promises, './README.md'))
      .chain((readme) => fromPromise(getFiles)(readme, promises))
      .chain(({ config, readme }) =>
        fromPromise(uploadReadme)(readme, bundlr, config)
      )
      .chain(({ tx, config }) =>
        fromPromise(updateConfig)(promises, config, tx)
      )
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
  };
}

/**
 *
 *
 * @author @jshaw-ar
 * @export
 */
export function setTx({ promises }) {
  /**
   * Sets the ant.tx in the config.
   */
  return async (tx) => {
    return Async.of(tx)
      .chain(validateTx)
      .chain(() => fromPromise(getFile)(promises, './.packajs/config.json'))
      .chain(parseJson)
      .chain((config) => fromPromise(updateConfig)(promises, config, tx))
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
  };
}

async function getFiles(readme, promises) {
  try {
    const config = JSON.parse(
      await getFile(promises, './.packajs/config.json')
    );

    return {
      readme,
      config,
    };
  } catch (error) {
    console.error(chalk.red('There was an error getting your config file.'));
    throw new Error(error?.message);
  }
}

async function uploadReadme(readme, bundlr, config) {
  console.log(chalk.yellow(`Uploading readme.`));
  const tags = [
    { name: 'Content-Type', value: 'text/markdown; charset=utf-8' },
  ];

  const response = await bundlr.upload(readme, {
    tags,
  });

  console.log(
    `${chalk.green('readme uploaded')} ==> ${chalk.underline(
      `https://arweave.net/${response.id}`
    )}`
  );
  return { tx: response.id, config };
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 * @param {Object} config The options for publishing the JavaScript file.
 * @param {string} tx The tx to be updated.
 *
 */

async function updateConfig(promises, config, tx) {
  console.log(chalk.yellow(`Uploading ./.packajs/config.json.`));

  await promises.writeFile(
    './.packajs/config.json',
    JSON.stringify(
      {
        ...config,
        readme: tx,
      },
      null,
      2
    )
  );
  console.log(chalk.green(`./.packajs/config.json updated.`));
}

// async function updateConfig(promises) {}

/**
 *
 *
 * @author @jshaw-ar
 * @param {string} tx
 * @param {string} [label]
 */
function validateTx(tx, label) {
  if (!isTx(tx)) return Rejected(`Please pass a valid ${label || 'tx'}.`);
  return Resolved(tx);
}

function parseJson(json) {
  try {
    return Resolved(JSON.parse(json));
  } catch (error) {
    return Rejected('The ./.packajs/config.json is invalid JSON.');
  }
}

const ARNS_REGISTRY = 'bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U';

const nameToBuy = 'saif';

const checkExists = (response, ant) => {
  const records = response?.state?.records;
  if (!records) return Rejected("Couldn't find records on the registry state.");
  if (!records[ant]) return Rejected(`ANT (${ant}) not found.`);
  return Resolved(response);
};

const getAntTx = (response, ant) => {
  return response?.state?.records[ant]?.contractTxId;
};

const fetcNameRegistryState = async (dre, promises) => {
  const response = await fetch(
    `https://${dre}.warp.cc/contract/?id=${ARNS_REGISTRY}`
  );
  if (!response.ok) {
    throw new Error('Error fetching ARNS Registry state.');
  }
  const results = await response.json();
  // @ts-ignore
  if (results?.status === 'blacklisted') {
    throw new Error(`Blacklisted: ${dre}`);
  }
  return results;
};

function updateConfigForNameOption(promises, ant) {
  return Async.of(undefined)
    .chain(() => fromPromise(getFile)(promises, './.packajs/config.json'))
    .chain(parseJson)
    .chain((config) => fromPromise(updateConfig)(promises, config, ant));
}

// checkArnsExistence().then((records) => {
//     if (records[nameToBuy]) {
//         console.log("ArNS name already exists");
//     }
// }).catch(console.log);
