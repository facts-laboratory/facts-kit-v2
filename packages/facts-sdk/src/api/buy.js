import Async, { fromPromise } from '../common/hyper-async.js';
import { allowU } from './allow.js';
import { getPrice } from './get-price.js';

/**
 * Buy function
 *
 * @param {Object} options - Deployment options
 * @param {any} options.warp - Warp value
 * @param {any} options.signer - Signer value
 * @param {'node' | 'browser'} options.env - whether the app is running in node or the browser
 */
export function buy({ warp, signer, env }) {
  /**
   * Buys position tokens
   *
   * @param {Object} props - parameters
   * @param {string} props.tx - contract ID
   * @param {'support' | 'oppose'} props.position - Position value
   * @param {number} props.qty - the amount of tokens in the base unit
   * @param {'node' | 'browser'} props.env - Deploy plugin value
   *
   * @returns {Promise<{tx: string, result: {qty: number; price: number; fee: number; owner: { addr: string; position: string; }, position: string; factMarket: string}, dre: string}>} - Promise with the result of getPrice
   */
  return async ({ qty, tx, position }) => {
    return Async.of({ qty, tx, position, warp })
      .chain(fromPromise(getPriceWrapper))
      .chain(({ result, dre }) =>
        fromPromise(allowU)(tx, result, dre, warp, signer, env)
      )
      .chain(({ result, allowTx, dre }) =>
        fromPromise(factMarketPosition)(
          tx,
          allowTx,
          result,
          dre,
          warp,
          signer,
          env
        )
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
 * @param {'node' | 'browser'} env
 * @return {Promise<{tx: string, result: any, dre: string}>}
 */
const factMarketPosition = async (
  tx,
  allowTx,
  result,
  dre,
  warp,
  signer,
  env
) => {
  if (env === 'browser') {
    await signer.setPublicKey();
  }
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
