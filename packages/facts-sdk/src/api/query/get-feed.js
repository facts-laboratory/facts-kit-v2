import { getEdges, getNode } from '../../common/util.js';

/**
 * Gets a transaction by id.
 *
 * @author @jshaw-ar
 * @export
 * @param {string} [topic]
 * @return {Promise<import('../../common/util').Transaction>}
 */
export async function getFeed(
  topic
  // TODO: setup cursor func
  // cursor
) {
  const res = topic
    ? await fetch('https://arweave.net/graphql', {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.7',
          'content-type': 'application/json',
        },
        body: `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(\\n    first: 30\\n    tags: [{name: \\\"Topic:${topic}\\\", values: [\\\"${topic}\\\"]}, {name: \\\"Facts-Protocol-Version\\\", values: [\\\"0.1.0\\\"]}]\\n  ) {\\n    edges {\\n      node {\\n        block {\\n          timestamp\\n          height\\n        }\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`,
        method: 'POST',
      })
    : await fetch('https://arweave.net/graphql', {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.7',
          'content-type': 'application/json',
        },
        body: `{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  transactions(first: 30, tags: [{name: \\\"Facts-Protocol-Version\\\", values: [\\\"0.1.0\\\"]}]) {\\n    edges {\\n      node {\\n        block {\\n          timestamp\\n          height\\n        }\\n        id\\n        owner {\\n          address\\n        }\\n        tags {\\n          name\\n          value\\n        }\\n      }\\n    }\\n  }\\n}\\n\"}`,
        method: 'POST',
      });
  const edges = getEdges(await res.json()).map(getNode);
  return edges;
}

// query {
//       transactions(
//           first: 30,
//         # ids:["${tx}"],
//             tags: [
//               # { name: "Type", values: ["${renderForType}"]},
//               { name: "Topic:${topic}", values: ["${topic}"]}
//               { name: "Facts-Protocol-Version", values: ["0.1.0"]}
//             ]
//       )
//   {
//           edges {
//               node {
//                   block {
// 			timestamp
//                     height
//                   }
//                   id
//                     owner {
//                       address
//                     }
//                     tags {
//                       name
//                         value
//                     }
//             }}
//         }
//     }
