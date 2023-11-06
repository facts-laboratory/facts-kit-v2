import React, { useEffect, useState } from "react";
import { fetchTx } from "./fetch-data";

/**
 * @typedef {Object} Transaction
 * @property {Object} block - The block information.
 * @property {number} block.timestamp - The timestamp of the block.
 * @property {number} [block.height] - The height of the block (optional).
 * @property {string} id - The ID of the transaction.
 * @property {Object} owner - The owner information.
 * @property {string} owner.address - The address of the owner.
 * @property {Array<Object>} tags - An array of tags associated with the transaction.
 * @property {string} tags[].name - The name of the tag.
 * @property {string} tags[].value - The value of the tag.
 */

/**
 * A community notes style for Permaweb content built on top of fact markets.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.tx] - Optional string representing the transaction.
 * @param {Transaction} [props.transaction] - Optional transaction.
 * @returns {React.ReactNode}
 */
export const FactNote = ({ tx, transaction }) => {
  const [dataClone, setData] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (transaction) return setData(transaction);
    /**
     * Fetches the data based on the 'tx' prop and sets it to the component state.
     * Sets the error state to 'true' if an error occurs during the data fetching process.
     */
    const fetchData = () => {
      if (!error && !tx && !transaction)
        return setError("Please pass a tx or a transaction.");
      if (!error && !dataClone && transaction) return setData(transaction);

      if (!error && !transaction && tx) {
        fetchTx(tx)
          .then(setData)
          .catch((e) => setError(e.message));
      }
    };
    fetchData();
  }, [tx, error]);

  if (error) return <p>{error}</p>;
  return <p>{JSON.stringify(dataClone)}</p>;
};

export default FactNote;
