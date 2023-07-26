import Async, { Resolved, fromPromise } from '../common/hyper-async.js';
import { viewState } from '../common/util.js';

/**
 * @typedef {Object} GetPriceOutput
 * @property {Object} result
 * @property {number} result.qty
 * @property {number} result.price
 * @property {number} result.fee
 * @property {Object} result.owner
 * @property {string} result.owner.addr
 * @property {string} result.owner.position
 * @property {string} result.position
 * @property {string} result.factMarket
 * @property {string} dre
 */

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} warp
 */
export function getPrice(warp) {
  /**
   * Async function that performs deployment.
   *
   * @param {Object} props - Deployment parameters
   * @param {string} props.tx - Rebut transaction
   * @param {'support' | 'oppose'} props.position - Position value
   * @param {number} props.qty - the amount of tokens in the base unit
   * @returns {Promise<GetPriceOutput>} - Promise with the result of getPrice
   */
  return async ({ qty, tx, position }) =>
    Async.of(tx)
      .chain((/** @type {string} */ tx) =>
        fromPromise(viewState)(
          tx,
          {
            function: 'get-price',
            position: position,
            qty: qty,
          },
          'dre-4',
          warp
        )
      )
      // .bichain(
      //   () =>
      //     fromPromise(viewState)(
      //       tx,
      //       {
      //         function: 'get-price',
      //         position: position,
      //         qty: qty,
      //       },
      //       'dre-6',
      //       warp
      //     ),
      //   Resolved
      // )
      // .bichain(
      //   () =>
      //     fromPromise(viewState)(
      //       tx,
      //       {
      //         function: 'get-price',
      //         position: position,
      //         qty: qty,
      //       },
      //       'dre-1',
      //       warp
      //     ),
      //   Resolved
      // )
      // .bichain(
      //   () =>
      //     fromPromise(viewState)(
      //       tx,
      //       {
      //         function: 'get-price',
      //         position: position,
      //         qty: qty,
      //       },
      //       'dre-4',
      //       warp
      //     ),
      //   Resolved
      // )
      // .bichain(
      //   () =>
      //     fromPromise(viewState)(
      //       tx,
      //       {
      //         function: 'get-price',
      //         position: position,
      //         qty: qty,
      //       },
      //       'dre-6',
      //       warp
      //     ),
      //   Resolved
      // )
      // .bichain(
      //   () =>
      //     fromPromise(viewState)(
      //       tx,
      //       {
      //         function: 'get-price',
      //         position: position,
      //         qty: qty,
      //       },
      //       'dre-5',
      //       warp
      //     ),
      //   Resolved
      // )
      .fork(
        (/** @type {{ message: any; }} */ error) => {
          throw new Error(error?.message || error || 'An error occurred');
        },

        ({ interaction, dre }) => ({ result: interaction.result, dre })
      );
}
