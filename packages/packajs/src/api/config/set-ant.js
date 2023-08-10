import Async, {
  Rejected,
  Resolved,
  fromPromise,
} from '../../common/hyper-async.js';
import chalk from 'chalk';
import { getFile, isTx, parseJson } from '../../common/util.js';
import fetch from 'node-fetch';

/**
 *
 *
 * @author @jshaw-ar
 * @export
 */
export function setAnt({ promises }) {
  /**
   * Sets the ant.tx in the config.
   * @param {string} ant The tx id of the ant.
   * @param {*} options The options for publishing the JavaScript file.
   */
  return async (ant, options) => {
    if (options.name)
      return Async.of(undefined)
        .chain(() => fromPromise(fetcNameRegistryState)('dre-1', promises))
        .bichain(
          () => fromPromise(fetcNameRegistryState)('dre-3', promises),
          Resolved
        )
        .chain((response) => checkExists(response, ant))
        .bichain(
          () => fromPromise(fetcNameRegistryState)('dre-4', promises),
          Resolved
        )
        .chain((response) => checkExists(response, ant))
        .map((response) => getAntTx(response, ant))
        .chain(validateAnt)
        .chain((ant) => updateConfigForNameOption(promises, ant))
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
    return Async.of(ant)
      .chain(validateAnt)
      .chain(() => fromPromise(getFile)(promises, './.packajs/config.json'))
      .chain(parseJson)
      .chain((config) => fromPromise(updateConfig)(promises, config, ant))
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
 * @param {string} ant
 */
function validateAnt(ant) {
  if (!isTx(ant)) return Rejected('Please pass a valid ANT tx.');
  return Resolved(ant);
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 * @param {Object} config The options for publishing the JavaScript file.
 * @param {string} ant The ant to be updated.
 *
 */
async function updateConfig(promises, config, ant) {
  console.log(chalk.yellow('Updating ant.tx in ./.packajs/config.json'));
  const newConfig = {
    ...config,
    ant: {
      ...config.ant,
      tx: ant,
    },
  };

  await promises.writeFile(
    './.packajs/config.json',
    JSON.stringify(newConfig, null, 2)
  );
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
