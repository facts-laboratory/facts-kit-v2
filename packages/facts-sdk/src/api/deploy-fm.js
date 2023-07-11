import {
  FACT_MARKET_SRC,
  U_TX,
  getAns110TagsFromUser,
  getFactsTags,
} from '../common/constants.js';
import Async, { fromPromise } from '../common/hyper-async.js';

/**
 * @typedef {Object} PermafactsTags
 * @property {string[]} [topics] - Optional array of topics
 * @property {string} type - The type
 * @property {string} title - The title
 * @property {string} description - The description
 * @property {string} [renderWith] - Optional string for rendering
 * @property {string} [cover] - Optional cover string
 */

/**
 * Deploy function.
 *
 * @param {Object} props - deploy props
 * @param {any} props.warp - Warp instance
 * @param {any} props.signer - Signer value
 * @param {any} props.deployPlugin - Deploy plugin value
 * @param {'node' | 'browser'} props.env - Deploy plugin value
 */
export function deploy({ warp, signer, deployPlugin, env }) {
  /**
   * Async function that performs deployment.
   *
   * @param {Object} props - Deployment parameters
   * @param {string} [props.rebutTx] - Rebut transaction
   * @param {'support' | 'oppose'} props.position - Position value
   * @param {PermafactsTags} props.tags - PermafactsTags object
   * @param {*} props.data - Data object
   * @param {Array.<{name: string, value: string}>} [props.extraTags] - extra tags to attach to the transaction
   * @returns {Promise<string>} - the tx id fo the fact market
   */
  return async ({ rebutTx, position, tags, data, extraTags }) => {
    const newTags = [
      ...getAns110TagsFromUser(tags),
      ...getFactsTags(rebutTx),
      ...(extraTags || []),
    ];
    return Async.of({ position, tags: newTags, data })
      .chain(({ position, tags, data }) =>
        fromPromise(warpDeploy)({
          position,
          tags,
          data,
          warp,
          signer,
          deployPlugin,
          env,
        })
      )
      .fork(
        (error) => {
          throw new Error(error?.message || error || 'An error occurred.');
        },
        (output) => output
      );
  };
}

const warpDeploy = async ({
  position,
  tags,
  data,
  warp,
  signer,
  deployPlugin,
  env,
}) => {
  if (env === 'browser') {
    await signer.setPublicKey();
  }
  const client = warp.use(deployPlugin);
  const opts = {
    evaluationManifest: {
      evaluationOptions: {
        sourceType: 'both',
        internalWrites: true,
        allowBigInt: true,
        unsafeClient: 'skip',
      },
    },
  };

  const { contractTxId } = await client.deployFromSourceTx({
    wallet: signer,
    initState: JSON.stringify({
      burn: 0,
      pair: U_TX,
      title: tags?.filter((t) => t.name === 'Title')[0]?.value || 'Untitled',
      oppose: {},
      ticker: 'FACTMKT',
      balances: {},
      position: position,
      register: false,
      creator_cut: 0,
    }),
    data: {
      'Content-Type': 'application/json',
      body: JSON.stringify(data),
    },
    srcTxId: FACT_MARKET_SRC,
    tags,
    ...opts,
  });

  return contractTxId;
};
