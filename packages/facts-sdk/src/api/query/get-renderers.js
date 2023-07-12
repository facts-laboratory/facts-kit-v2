import { getEdges, getNode } from '../../common/util.js';

/**
 * Gets a transaction by id.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} renderForType
 * @param {string} cursor
 * @return {Promise<import('../../common/util').Transaction>}
 */
export async function getRenderForRenderers(
  renderForType,
  // this doesnt do anything yet but should paginate
  cursor
) {
  const query = `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(\\n    first: 100\\n    tags: [{name: \\\"Render-For\\\", values: [\\\"${renderForType}\\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`;
  const paginate = `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(\\n    first: 100\\n    tags: [{name: \\\"Render-For\\\", values: [\\\"${renderForType}\\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`;
  const res = await fetch('https://arweave.net/graphql', {
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.7',
      'content-type': 'application/json',
    },
    body: cursor ? paginate : query,
    method: 'POST',
  });
  const node = getEdges(await res.json()).map(getNode);
  return node;
}
