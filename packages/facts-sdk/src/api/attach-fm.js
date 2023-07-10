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
 * @param {Object} options - Deployment options
 * @param {string} options.warp - Warp value
 * @param {string} options.signer - Signer value
 * @param {string} options.deployPlugin - Deploy plugin value
 * @param {'node' | 'browser'} options.env - Deploy plugin value
 * @returns {Function} - Async function that returns a Promise
 */
export function attach({ warp, signer, deployPlugin, env }) {
  /**
   * Async function that performs deployment.
   *
   * @param {Object} params - Deployment parameters
   * @param {string} [params.rebutTx] - Rebut transaction
   * @param {'support' | 'oppose'} params.position - Position value
   * @param {PermafactsTags} params.tags - PermafactsTags object
   * @param {*} params.data - Data object
   * @param {Array.<{name: string, value: string}>} [params.extraTags] - extra tags to attach to the transaction
   * @param {string} [params.attachToTx] - the tx to attach the fact market to.
   * @returns {Promise<string>} - the tx id fo the fact market
   */
  return async ({ rebutTx, position, tags, data, extraTags, attachToTx }) => {
    // todo: validate()
    if (!attachToTx)
      throw new Error(
        'Please pass attachToTx to represent the tx the fact market is being attached to.'
      );
    // todo: createTags()
    const newTags = [
      { name: 'Data-Source', value: attachToTx },
      ...getAns110TagsFromUser(tags),
      ...getFactsTags(rebutTx),
      ...(extraTags || []),
    ];
    return Async.of({ rebutTx, position, tags: newTags, data })
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
      position,
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
