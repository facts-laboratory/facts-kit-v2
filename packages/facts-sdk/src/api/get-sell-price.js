import Async, {
  Rejected,
  Resolved,
  fromPromise,
} from "../common/hyper-async.js";
import { viewState } from "../common/util.js";

/**
 * @typedef {Object} GetPriceOutput
 * @property {Object} result
 * @property {number} result.qty
 * @property {number} result.price
 * @property {number} result.fee
 * @property {Object} result.owner
 * @property {string} result.owner.addr
 * @property {string} result.owner.position
 * @property {string} result.position
 * @property {string} result.factMarket
 * @property {string} dre
 */

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} warp
 */
export function getSellPrice(warp) {
  /**
   * Async function that performs deployment.
   *
   * @param {Object} props - Deployment parameters
   * @param {string} props.tx - Rebut transaction
   * @param {'support' | 'oppose'} props.position - Position value
   * @param {number} props.qty - the number of position tokens being sold
   * @returns {Promise<{u: number; position: 'support' | 'oppose'}>} - Promise with the result of getPrice
   */
  return async ({ tx, position, qty }) =>
    Async.of({ tx, warp, position })
      .chain(fromPromise(getSupply))
      .chain((supply) => validateSupply({ supply, qty }))
      .map((supply) => getUAmount({ supply, position, qty }))
      .fork(
        (/** @type {{ message: any; }} */ error) => {
          throw new Error(error?.message || error || "An error occurred");
        },
        (output) => output
      );
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {{ tx: string, warp: any, position: 'support' | 'oppose'; }} input
 * @return {Promise<number>}
 */
const getSupply = async ({ tx, warp, position }) => {
  return Async.of(tx)
    .chain((/** @type {string} */ tx) =>
      fromPromise(viewState)(
        tx,
        {
          function: "get-supply",
        },
        "dre-u",
        warp
      )
    )
    .bichain(
      () =>
        fromPromise(viewState)(
          tx,
          {
            function: "get-supply",
          },
          "dre-u",
          warp
        ),
      Resolved
    )
    .chain((res) => getPosition({ res, position }))
    .toPromise();
};

const getPosition = ({ res, position }) => {
  return position === "support"
    ? Resolved(res.interaction.result.support)
    : Resolved(res.interaction.result.oppose);
};

const validateSupply = ({ supply, qty }) => {
  if (supply < qty) {
    return Rejected("Supply is less than quantity.");
  }
  return Resolved(supply);
};

const getUAmount = ({ position, supply, qty }) => {
  const u = calculateSell(supply, qty);

  return { u, position };
};

const calculateSell = (supply, qty) => {
  const safeQty = Math.floor(qty);
  const price = calculatePrice(1, 1, supply, supply - safeQty) * -1;
  return Math.ceil(price);
};

/**
 *
 *
 * @export
 * @param {number} m slope
 * @param {number} C constant (should be 1)
 * @param {number} x1 first point on the x-axis
 * @param {number} x2 second point on the x-axis
 * @return {number}
 */
export function calculatePrice(m, C, x1, x2) {
  // The antidirivitive of f(x) = m * x;
  const F = (x) => (m * (x * x)) / 2 + C;

  // Return the difference between the values of the antiderivative at x1 and x2
  // This calculates the "Area under the curve"
  // Calculates the "Definite Integral"
  return F(x2) - F(x1);
}
