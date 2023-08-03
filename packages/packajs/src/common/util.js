import {
  MAX_ARNS_NAME_LENGTH,
} from './constants.js';
import { Rejected, Resolved } from './hyper-async.js';

/**
 * @typedef {Object} PublishOptions
 */

/**
 *
 * @author @jshaw-ar
 * @export
 * @todo turn this into an async pipe so it's easier to read
 * @param {string} tx
 * @return {Promise<any>}
 */
export const readState = async (tx, dre, warp) => {
  try {
    const read = await warp
      .contract(tx)
      .connect('use_wallet')
      .setEvaluationOptions({
        internalWrites: true,
        unsafeClient: 'skip',
        remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
        remoteStateSyncEnabled: true,
        allowBigInt: true,
      })
      .readState();

    return read.cachedValue.state;
  } catch (error) {
    throw new Error(`There was an error evaluating state using ${dre}.`);
  }
};

/**
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {any} input
 * @param {string} dre
 * @return {Promise<any>}
 */
export const viewState = async (tx, input, dre, warp) => {
  const interaction = warp
    .contract(tx)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState(input);
  if ((await interaction).type === 'ok') return interaction;
  throw new Error(`There was an error evaluating state using ${dre}.`);
};

/**
 *
 * @param {PublishOptions} options
 */
export const hasOptions = (options) => {
  if (!options) return Rejected('There were no options passed to the command.');
  return Resolved(options);
};

/**
 *
 * @param {PublishOptions} options
 */
export const hasWallet = (options) => {
  if (!options?.wallet)
    return Rejected(
      'Please pass a wallet file to the command. eg. -w /path/to/wallet.json'
    );
  return Resolved(options);
};

/**
 *
 * @param {string} name
 * @param {PublishOptions} options
 */
export const validateArns = async (name, options) => {
  // if (!/^(?:[a-zA-Z0-9])+[a-zA-Z0-9-]*(?:[a-zA-Z0-9])$/.test(name)) {
  //   console.log("bad combination of characters");
  //   throw new Error("This subdomain is not allowed");
  // }

  if (name === 'www') {
    console.log('www is not allowed');
    throw new Error('This subdomain is not allowed');
  }

  if (name.length > MAX_ARNS_NAME_LENGTH) {
    throw new Error('This subdomain is too long');
  }

  // Make sure the wallet being used owns or controls the ARNS name being updated.
  return options;
};