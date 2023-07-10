import Async, { Resolved, fromPromise } from '../common/hyper-async.js';

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} warp
 * @return {*}
 */
export function sell({ warp, signer }) {
  return async ({ qty, tx, position }) => {
    return Async.of({ qty, tx, position, warp })
      .chain(({ qty, tx, position, warp }) =>
        fromPromise(interact)({ qty, tx, position, warp, signer, dre: 'dre-3' })
      )
      .bichain(
        () =>
          fromPromise(interact)({
            qty,
            tx,
            position,
            warp,
            signer,
            dre: 'dre-2',
          }),
        Resolved
      )
      .bichain(
        () =>
          fromPromise(interact)({
            qty,
            tx,
            position,
            warp,
            signer,
            dre: 'dre-1',
          }),
        Resolved
      )
      .bichain(
        () =>
          fromPromise(interact)({
            qty,
            tx,
            position,
            warp,
            signer,
            dre: 'dre-4',
          }),
        Resolved
      )
      .bichain(
        () =>
          fromPromise(interact)({
            qty,
            tx,
            position,
            warp,
            signer,
            dre: 'dre-5',
          }),
        Resolved
      )
      .bichain(
        () =>
          fromPromise(interact)({
            qty,
            tx,
            position,
            warp,
            signer,
            dre: 'dre-6',
          }),
        Resolved
      )
      .fork(
        (/** @type {{ message: any; }} */ error) => {
          throw new Error(error?.message || error || 'An error occurred');
        },
        (/** @type {string} */ output) => output
      );
  };
}

const interact = async ({ qty, tx, position, warp, dre, signer }) => {
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
      function: 'sell',
      position,
      qty,
    });

  return interaction.originalTxId;
};
