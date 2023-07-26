import Async, { Resolved, fromPromise } from '../common/hyper-async.js';
import { viewState } from '../common/util.js';

/**
 * @typedef {Object} GetBalanceOutput
 * @property {Object} result
 * @property {string} result.target
 * @property {string} result.ticker
 * @property {number} result.balance
 * @property {Object} result.balances
 * @property {number} result.balances.support
 * @property {number} result.balances.oppose
 * @property {string} dre
 */

/**
 * Calls get-balance on a fact market
 *
 * @author @jshaw-ar
 * @export
 * @param {*} warp
 */
export function getBalance(warp) {
  /**
   * Async function that performs deployment.
   *
   * @param {Object} props - Deployment parameters
   * @param {string} props.tx - fact market tx
   * @param {string} props.target - address of the target
   * @returns {Promise<GetBalanceOutput>} - Promise with the result of getBalance
   */
  return async ({ tx, target }) =>
    Async.of(tx)
      .chain((/** @type {string} */ tx) =>
        fromPromise(viewState)(
          tx,
          {
            function: 'balance',
            target,
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
      //         function: 'balance',
      //         target,
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
      //         function: 'balance',
      //         target,
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
      //         function: 'balance',
      //         target,
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
      //         function: 'balance',
      //         target,
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
      //         function: 'balance',
      //         target,
      //       },
      //       'dre-5',
      //       warp
      //     ),
      //   Resolved
      // )
      .fork(
        (error) => {
          throw new Error(error?.message || error || 'An error occurred');
        },
        ({ interaction, dre }) => {
          return { result: interaction.result, dre };
        }
      );
}
