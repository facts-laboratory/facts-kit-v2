/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} tx
 * @return {Promise<InteractionsDocument>}
 */
export async function getFactPositions(
  tx
  // this doesnt do anything yet but should paginate
  // cursor
) {
  const res = await fetch(
    `https://gateway.warp.cc/gateway/interactions?contractId=${tx}`
  );
  const data = await res.json();
  return data;
}
