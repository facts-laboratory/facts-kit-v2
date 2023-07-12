import { U_TX } from '../common/constants.js';

/**
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {any} result
 * @param {string} dre
 * @param {any} warp
 * @param {any} signer
 * @param {'node' | 'browser'} env
 * @return {Promise<{allowTx: string, result: any, dre: string}>}
 */
export const allowU = async (tx, result, dre, warp, signer, env) => {
  const { price, fee } = result;

  if (env === 'browser') {
    await signer.setPublicKey();
  }

  const interaction = await warp
    .contract(U_TX)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .connect(signer)
    .writeInteraction({
      function: 'allow',
      target: tx,
      qty: price + fee,
    });

  return { allowTx: interaction.originalTxId, result, dre };
};
