import Async, { Resolved, fromPromise } from '../common/hyper-async.js';

/**
 * Sell function
 *
 * @param {Object} options - Deployment options
 * @param {any} options.warp - Warp value
 * @param {any} options.signer - Signer value
 * @param {'node' | 'browser'} options.env - whether the app is running in node or the browser
 */
export function sell({ warp, signer, env }) {
  /**
   * Sell position tokens.
   *
   * @param {Object} props - parameters
   * @param {string} props.tx - contract id
   * @param {'support' | 'oppose'} props.position - Position value
   * @param {number} props.qty - the amount of tokens in the base unit
   * @returns {Promise<string>} - tx id of interaction
   */
  return async ({ qty, tx, position }) => {
    return (
      Async.of({ qty, tx, position, warp })
        .chain(({ qty, tx, position, warp }) =>
          fromPromise(interact)({
            qty,
            tx,
            position,
            warp,
            signer,
            dre: 'dre-5',
            env,
          })
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
              env,
            }),
          Resolved
        )
        // .bichain(
        //   () =>
        //     fromPromise(interact)({
        //       qty,
        //       tx,
        //       position,
        //       warp,
        //       signer,
        //       dre: 'dre-1',
        //       env,
        //     }),
        //   Resolved
        // )
        // .bichain(
        //   () =>
        //     fromPromise(interact)({
        //       qty,
        //       tx,
        //       position,
        //       warp,
        //       signer,
        //       dre: 'dre-4',
        //       env,
        //     }),
        //   Resolved
        // )
        // .bichain(
        //   () =>
        //     fromPromise(interact)({
        //       qty,
        //       tx,
        //       position,
        //       warp,
        //       signer,
        //       dre: 'dre-5',
        //       env,
        //     }),
        //   Resolved
        // )
        // .bichain(
        //   () =>
        //     fromPromise(interact)({
        //       qty,
        //       tx,
        //       position,
        //       warp,
        //       signer,
        //       dre: 'dre-6',
        //       env,
        //     }),
        //   Resolved
        // )
        .fork(
          (/** @type {{ message: any; }} */ error) => {
            throw new Error(error?.message || error || 'An error occurred');
          },
          (/** @type {string} */ output) => output
        )
    );
  };
}

const interact = async ({ qty, tx, position, warp, dre, signer, env }) => {
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
      function: 'sell',
      position,
      qty,
    });

  return interaction.originalTxId;
};
