import { getEdges, getNode } from '../../common/util.js';

/**
 * Gets a transaction by id.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {Promise<import('../../common/util').Transaction>}
 */
export async function getById(tx) {
  const body = `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(first: 1, ids: [\\\"${tx}\\\"]) {\\n    edges {\\n      node {\\n        block {\\n          timestamp\\n          height\\n        }\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`;
  const res = await fetch('https://arweave.net/graphql', {
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.7',
      'content-type': 'application/json',
    },
    body,
    method: 'POST',
  });
  const node = getEdges(await res.json()).map(getNode);
  return node;
}
