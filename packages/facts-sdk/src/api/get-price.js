/* eslint-disable no-useless-escape */
import Async, { Resolved, fromPromise } from '../common/hyper-async.js';
import { viewState } from '../common/util.js';

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} warp
 * @return {*}
 */
export function getPrice(warp) {
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
