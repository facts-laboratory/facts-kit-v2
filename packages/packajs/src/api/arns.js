import chalk from 'chalk';
import Async, { fromPromise } from '../common/hyper-async.js';
import { hasOptions, hasWallet, validateArns } from '../common/util.js';
import { ARNS_REGISTRY, ANT_SOURCE } from '../common/constants.js';

/**
 * @author ar://saif
 * @typedef {Object} PublishOptions
 */

/**
 *
 * @param {string} name The name of the ARNS
 * @param {string} tx The transaction id of the resource.
 * @param {object} wallet The wallet of the user.
 * @param {object} warp The warp instance.
 * @param {object} arweave The arweave instance.
 */
export function ArNs(name, tx, wallet, warp, arweave) {
  /**
   * check if the arns name is available then register it.
   * @param {PublishOptions} options The options for publishing the JavaScript file.
   */
  return async (options) =>
    Async.of(options)
      .chain(fromPromise(validateInput))
      .chain(() => {
        return fromPromise(registerNewArnsName)(
          name,
          tx,
          wallet,
          warp,
          arweave
        );
      })
      .fork(
        (error) => {
          console.error(
            chalk.red(error?.message || error || 'An error occurred.')
          );
          process.exit();
        },
        (output) => {
          console.log(
            chalk.blue('\n\n===========output=============\n'),
            chalk.green(output),
            chalk.blue('\n=============end==============\n\n')
          );
          return output;
        }
      );
}

/**
 * @param {PublishOptions} options The options for publishing the JavaScript file.
 */
const validateInput = async (options) => {
  return Async.of(options)
    .chain(hasOptions)
    .chain(hasWallet)
    .chain(fromPromise(validateArns))
    .toPromise();
};

/**
 * @param {string} name The name of the ARNS to register.
 * @param {string} tx The transaction id of the resource.
 * @param {object} wallet The wallet of the user.
 * @param {object} warp The warp instance.
 * @param {object} arweave The arweave instance.
 */
const registerNewArnsName = async (name, tx, wallet, warp, arweave) => {
  // check if it exist
  const registry = warp.pst(ARNS_REGISTRY).connect(wallet);
  const registryState = await registry.currentState();
  if (registryState.records[name]) {
    throw new Error('ArNS name already exists');
  }

  // check if the user has enough arns token
  const owner = await arweave.wallets.jwkToAddress(wallet);
  const arnsBalance = registryState.balances[owner];
  if (
    typeof arnsBalance === 'undefined' ||
    arnsBalance < registryState.fees[name.length]
  ) {
    throw new Error(`Not enough ArNS Token to purchase ${name}.`);
  }

  // create ANT
  const ant = await warp.createContract.deployFromSourceTx(
    {
      wallet: wallet,
      initState: JSON.stringify({
        ticker: `ANT-${name.toUpperCase()}`,
        name,
        owner,
        controller: owner,
        evolve: null,
        records: {
          ['@']: tx,
        },
        balances: {
          [owner]: 1,
        },
      }),
      srcTxId: ANT_SOURCE,
    },
    true
  );

  // buy ArNS
  if (ant.contractTxId) {
    const response = await registry.writeInteraction(
      {
        function: 'buyRecord',
        name,
        contractTxId: ant.contractTxId,
        tierNumber: 1,
        years: 1,
      },
      { disableBundling: true }
    );

    // console.log(`response ==> ${JSON.stringify(response)}`);

    return `ArNs Registered ==> ${name}.arweave.dev`;
  } else {
    throw new Error('Failed to register ArNS');
  }
};
