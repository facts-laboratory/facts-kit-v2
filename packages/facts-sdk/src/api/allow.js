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
 * @return {Promise<{allowTx: string, result: any, dre: string}>}
 */
export const allowU = async (tx, result, dre, warp, signer) => {
  const { price, fee } = result;

  console.log('INPUTS', dre, price, fee, tx, signer);

  const contract = warp
    .contract(U_TX)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .connect(signer);

  console.log('CONTRACT SETUP', contract);
  const interaction = await contract.writeInteraction({
    function: 'allow',
    target: tx,
    qty: price + fee,
  });

  console.log('DONE!', interaction);
  return { allowTx: interaction.originalTxId, result, dre };
};
