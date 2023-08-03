/**
 * @description Gets 'tx' from the query string -- returns null if it doesn't exist
 * @example getTx(window?.location?.search);
 * @author @jshaw_ar
 * @param {string} queryString
 * @return {*} value of tx or null
 */
export function getTxFromQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  return params.get('tx');
}
