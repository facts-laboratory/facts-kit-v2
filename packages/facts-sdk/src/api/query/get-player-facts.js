import { getEdges, getNode } from '../../common/util.js';

/**
 * Gets a transaction by id.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @param {string} cursor
 * @return {Promise<import('../../common/util').Transaction>}
 */
export async function getPlayerFacts(tx, cursor) {
  const query = `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(\\n    first: 30\\n    owners: [\\\"${tx}\\\"]\\n    tags: [{name: \\\"Facts-Protocol-Version\\\", values: [\\\"0.1.0\\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        block {\\n          timestamp\\n          height\\n        }\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`;
  const paginate = `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(\\n    first: 30\\n    owners: [\\\"${tx}\\\"]\\n    tags: [{name: \\\"Facts-Protocol-Version\\\", values: [\\\"0.1.0\\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        block {\\n          timestamp\\n          height\\n        }\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`;
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
