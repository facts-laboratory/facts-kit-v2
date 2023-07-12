import { getEdges, getNode } from '../../common/util.js';

/**
 * Get player rebuttals ids by player tx
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {Promise<import('../../common/util').Transaction>}
 */
export async function getPlayerRebuttalsIds(
  tx
  // TODO: setup cursor func
  // cursor
) {
  const res = await fetch('https://arweave.net/graphql', {
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.7',
      'content-type': 'application/json',
    },
    body: `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(\\n    first: 30\\n    owners: [\\\"${tx}\\\"]\\n    tags: [{name: \\\"Facts-Protocol-Type\\\", values: [\\\"Rebuttal\\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        id\\n      }\\n    }\\n  }\\n}\\n\"}`,
    method: 'POST',
  });
  const nodes = getEdges(await res.json()).map(getNode);
  return nodes;
}
