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
  const interaction = await warp
    .contract(tx)
    .setEvaluationOptions({
      remoteStateSyncSource: `https://${dre}.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .viewState(input);
  if (interaction.type === 'ok') return { interaction, dre };
  throw new Error(`There was an error evaluating state using ${dre}.`);
};

/**
 * @typedef {Object} Transaction
 * @property {Object} block - The block information.
 * @property {number} block.timestamp - The timestamp of the block.
 * @property {string} id - The ID of the object.
 * @property {Object} owner - The owner information.
 * @property {string} owner.address - The address of the owner.
 * @property {Array} tags - An array of tags associated with the object.
 * @property {Object} tags[].name - The name of the tag.
 * @property {string} tags[].value - The value of the tag.
 */

/**
 * Pulls the node from the edge of the gql query response.
 *
 * @author @jshaw-ar
 * @param {any} edge
 * @return {Transaction}  {Transaction}
 */
export function getNode({ node }) {
  return node;
}

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} res
 * @return {*}
 */
export function getEdges(res) {
  if (!res?.data?.transactions?.edges) throw new Error('no edges');
  return res.data.transactions.edges;
}
