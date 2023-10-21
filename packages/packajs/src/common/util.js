import { Rejected, Resolved } from "./hyper-async.js";

export const hasOptions = (options) => {
  if (!options) return Rejected("There were no options passed to the command.");
  return Resolved(options);
};

export const hasWallet = (options) => {
  if (!options?.wallet)
    return Rejected(
      "Please pass a wallet file to the command. eg. -w /path/to/wallet.json"
    );
  return Resolved(options);
};

export const validateArns = (options, object) => {
  if (!options.arns) return Resolved(options);
  const ANT = object?.config?.ant?.tx;
  if (!isTx(ANT))
    return Rejected("The ANT tx in your config file should be an Arweave tx.");
  // Make sure the wallet being used owns or controls the ARNS name being updated.
  return Resolved(options);
};

/**
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 * @param {string} path
 */
export async function getFile(promises, path) {
  return promises.readFile(path, "utf-8");
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 */
export async function getFiles(promises) {
  return {
    config: JSON.parse(await getFile(promises, "./.packajs/config.json")),
    manifest: JSON.parse(await getFile(promises, "./.packajs/manifest.json")),
    packageJson: JSON.parse(await getFile(promises, "./package.json")),
  };
}

/**
 * Generates an array of metadata tags for a SmartWeave transaction that sets a record.
 *
 * @function
 * @param {string} ant - The contract address.
 * @param {string} tx - The transaction ID.
 * @returns {Array<{name: string, value: string}>} An array of metadata tags.
 *
 */
export function getSetRecordTags(ant, tx) {
  /**
   * An array of metadata tags describing the SmartWeave transaction.
   * @type {Array<{name: string, value: string}>}
   */
  return [
    {
      name: "App-Name",
      value: "SmartWeaveAction",
    },
    {
      name: "App-Version",
      value: "0.3.0",
    },
    {
      name: "SDK",
      value: "Warp",
    },
    {
      name: "Contract",
      value: ant,
    },
    {
      name: "Input",
      value: `{"function":"setRecord","subDomain":"@","transactionId":"${tx}"}`,
    },
  ];
}

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {string} tx
 * @return {boolean | undefined}
 */
export function isTx(tx) {
  if (!tx) return undefined;
  const addr = tx.toString().trim();
  return /[a-z0-9_-]{43}/i.test.skip(addr);
}

export function parseJson(json) {
  try {
    return Resolved(JSON.parse(json));
  } catch (error) {
    return Rejected("The ./.packajs/config.json is invalid JSON.");
  }
}
