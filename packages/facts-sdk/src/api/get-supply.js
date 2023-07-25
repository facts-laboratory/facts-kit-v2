import Async, { Resolved, fromPromise } from '../common/hyper-async.js';
import { viewState } from '../common/util.js';

/**
 * @typedef {Object} GetSupplyOutput
 * @property {Object} result
 * @property {number} result.total
 * @property {number} result.support
 * @property {number} result.oppose
 * @property {string} dre
 */

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} warp
 */
export function getSupply(warp) {
  /**
   * Async function that performs deployment.
   *
   * @param {Object} props - Deployment parameters
   * @param {string} props.tx - transaction
   * @returns {Promise<GetSupplyOutput>} - Promise with the result of getPrice
   */
  return async ({ tx }) =>
    Async.of(tx)
      .chain((/** @type {string} */ tx) =>
        fromPromise(viewState)(
          tx,
          {
            function: 'get-supply',
          },
          'dre-3',
          warp
        )
      )
      .bichain(
        () =>
          fromPromise(viewState)(
            tx,
            {
              function: 'get-supply',
            },
            'dre-4',
            warp
          ),
        Resolved
      )
      // .bichain(
      //   () =>
      //     fromPromise(viewState)(
      //       tx,
      //       {
      //         function: 'get-supply',
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
      //         function: 'get-supply',
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
      //         function: 'get-supply',
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
      //         function: 'get-supply',
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
