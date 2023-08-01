import { ARNS_REGISTRY } from './constants';

/**
 *
 * @author @jshaw-ar
 * @export
 * @todo turn this into an async pipe so it's easier to read
 * @param {string} tx
 * @return {Promise<any>}
 */
export const readState = async (tx, dre, warp) => {
  try {
    const read = await warp
      .contract(tx)
      .connect('use_wallet')
      .setEvaluationOptions({
        internalWrites: true,
        unsafeClient: 'skip',
        remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
        remoteStateSyncEnabled: true,
        allowBigInt: true,
      })
      .readState();

    return read.cachedValue.state;
  } catch (error) {
    throw new Error(`There was an error evaluating state using ${dre}.`);
  }
};

/**
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {any} input
 * @param {string} dre
 * @return {Promise<any>}
 */
export const viewState = async (tx, input, dre, warp) => {
  const interaction = warp
    .contract(tx)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState(input);
  if ((await interaction).type === 'ok') return interaction;
  throw new Error(`There was an error evaluating state using ${dre}.`);
};

export const getArnsRegistryState = async () => {
  const response = await fetch(
    `https://dre-3.warp.cc/contract/?id=${ARNS_REGISTRY}`
  );
  if (!response.ok) {
    throw new Error('Error fetching ARNS Registry state.');
  }

  return response.json();
};
