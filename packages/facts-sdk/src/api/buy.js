import Async, { fromPromise } from '../common/hyper-async.js';
import { allowU } from './allow.js';
import { getPrice } from './get-price.js';

/**
 * Buy function
 *
 * @param {Object} options - Deployment options
 * @param {any} options.warp - Warp value
 * @param {any} options.signer - Signer value
 */
export function buy({ warp, signer }) {
  return async ({ qty, tx, position }) => {
    return Async.of({ qty, tx, position, warp })
      .chain(fromPromise(getPriceWrapper))
      .chain(({ result, dre }) =>
        fromPromise(allowU)(tx, result, dre, warp, signer)
      )
      .chain(({ result, allowTx, dre }) =>
        fromPromise(factMarketPosition)(tx, allowTx, result, dre, warp, signer)
      )
      .fork(
        (/** @type {{ message: any; }} */ error) => {
          throw new Error(error?.message || error || 'An error occurred');
        },
        (/** @type {any} */ output) => output
      );
  };
}

/**
 *
 * @author @jshaw-ar
 * @param {{qty: number, tx: string, position: 'support' | 'oppose', warp: any}} input
 * @return {Promise<any>}
 */
const getPriceWrapper = async ({ qty, tx, position, warp }) => {
  return getPrice(warp)({ qty, tx, position });
};

/**
 *
 * @author @jshaw-ar
 * @param {string} tx
 * @param {string} allowTx
 * @param {any} result
 * @param {string} dre
 * @param {any} warp
 * @param {any} signer
 * @return {Promise<{tx: string, result: any, dre: string}>}
 */
const factMarketPosition = async (tx, allowTx, result, dre, warp, signer) => {
  const interaction = await warp
    .contract(tx)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .connect(signer)
    .writeInteraction({
      function: 'buy',
      ...result,
      tx: allowTx,
    });

  return { tx: interaction.originalTxId, result, dre };
};
