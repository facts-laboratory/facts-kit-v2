/**
 * @typedef {Object} Interaction
 * @property {string} id
 * @property {{ winston: string }} fee
 * @property {null} vrf
 * @property {Array<{ name: string, value: string }>} tags
 * @property {Object} block
 * @property {string} block.id
 * @property {number} block.height
 * @property {number} block.timestamp
 * @property {Object} owner
 * @property {string} owner.address
 * @property {string} source
 * @property {string} sortKey
 * @property {null} testnet
 * @property {{ winston: string }} quantity
 * @property {string} recipient
 * @property {string} signature
 * @property {Object} lastSortKey
 * @property {string} lastSortKey.tx
 * @property {number} lastSortKey.fee
 * @property {number} lastSortKey.qty
 * @property {Object} lastSortKey.owner
 * @property {string} lastSortKey.owner.addr
 * @property {string} lastSortKey.owner.position
 * @property {number} lastSortKey.price
 * @property {string} lastSortKey.function
 * @property {string} lastSortKey.position
 * @property {string} lastSortKey.factMarket
 * @property {string} bundlerTxId
 */

/**
 * @typedef {Object} Paging
 * @property {string} total
 * @property {number} limit
 * @property {number} items
 * @property {number} page
 * @property {number} pages
 */

/**
 * @typedef {Object} InteractionsDocument
 * @property {Paging} paging
 * @property {Interaction[]} interactions
 */
