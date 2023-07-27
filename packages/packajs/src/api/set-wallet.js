import Async, { Resolved, fromPromise } from '../common/hyper-async.js';
import { viewState } from '../common/util.js';

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} warp
 */
export function setWallet(warp) {
  /**
   * Async function that performs deployment.
   *
   * @param {Object} props - Deployment parameters
   * @param {string} props.tx - Rebut transaction
   * @param {'support' | 'oppose'} props.position - Position value
   * @param {number} props.qty - the amount of tokens in the base unit
   * @returns {Promise<{qty: number; price: number; fee: number; owner: { addr: string; position: string; }, position: string; factMarket: string}>} - Promise with the result of getPrice
   */
  return async ({ qty, tx, position }) =>
    Async.of(tx)
      .chain((tx) =>
        fromPromise(viewState)(
          tx,
          {
            function: 'get-price',
            position: position,
            qty: qty,
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
              function: 'get-price',
              position: position,
              qty: qty,
            },
            'dre-2',
            warp
          ),
        Resolved
      )
      .bichain(
        () =>
          fromPromise(viewState)(
            tx,
            {
              function: 'get-price',
              position: position,
              qty: qty,
            },
            'dre-2',
            warp
          ),
        Resolved
      )
      .bichain(
        () =>
          fromPromise(viewState)(
            tx,
            {
              function: 'get-price',
              position: position,
              qty: qty,
            },
            'dre-4',
            warp
          ),
        Resolved
      )
      .bichain(
        () =>
          fromPromise(viewState)(
            tx,
            {
              function: 'get-price',
              position: position,
              qty: qty,
            },
            'dre-6',
            warp
          ),
        Resolved
      )
      .bichain(
        () =>
          fromPromise(viewState)(
            tx,
            {
              function: 'get-price',
              position: position,
              qty: qty,
            },
            'dre-5',
            warp
          ),
        Resolved
      )
      .fork(
        (error) => {
          throw new Error(error?.message || error || 'An error occurred');
        },
        (interaction) => {
          return interaction.result;
        }
      );
}
