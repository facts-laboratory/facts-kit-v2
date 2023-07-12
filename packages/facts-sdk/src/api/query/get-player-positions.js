import { getEdges, getNode } from '../../common/util.js';

/**
 * Gets player positions by player tx id.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {string} cursor
 * @return {Promise<InteractionsDocument>}
 */
export async function getPlayerPositions(
  tx,
  // this doesnt do anything yet but should paginate
  cursor
) {
  const query = `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(\\n    first: 30\\n    owners: [\\\"${tx}\\\"]\\n    tags: [{name: \\\"Facts-Protocol-Type\\\", values: [\\\"Position\\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        block {\\n          timestamp\\n          height\\n        }\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`;
  const paginate = `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(\\n    first: 30\\n    owners: [\\\"${tx}\\\"]\\n    tags: [{name: \\\"Facts-Protocol-Type\\\", values: [\\\"Position\\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        block {\\n          timestamp\\n          height\\n        }\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`;
  const res = await fetch('https://arweave.net/graphql', {
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.7',
      'content-type': 'application/json',
    },
    body: cursor ? paginate : query,
    method: 'POST',
  });
  const nodes = getEdges(await res.json()).map(getNode);
  return nodes;
}
