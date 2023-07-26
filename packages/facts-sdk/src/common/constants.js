export const U_TX = 'KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw';
export const FACT_MARKET_SRC = 'eIAyBgHH-H7Qzw9fj7Austj30QKPQn27eaakvpOUSR8';

/**
 * @param {import("../api/deploy-fm").FactMarketTags} input
 * @return {Array<{name: string;value: string;}>} tags
 */
export const getAns110TagsFromUser = (input) => {
  const newTags = [];
  if (input.topics) {
    input?.topics?.forEach((/** @type {any} */ t) => {
      newTags.push({ name: `Topic:${t}`, value: t });
    });
  }
  if (input.renderWith)
    newTags.push({ name: 'Render-With', value: input.renderWith });
  if (input.cover) newTags.push({ name: 'Fact-Cover', value: input.cover });
  return [
    { name: 'Type', value: input.type || 'fact-post' },
    { name: 'Title', value: input.title },
    { name: 'Description', value: input.description },
    ...newTags,
  ];
};

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {string} [rebutTx]
 * @return {Array.<{name: string; value: string;}>} tags
 */
export const getFactsTags = (rebutTx) => {
  const factRebuts = rebutTx ? [{ name: 'Fact-Rebuts', value: rebutTx }] : [];
  return [
    {
      name: 'Facts-Protocol-Type',
      value: rebutTx ? 'Rebuttal' : 'Assertion',
    },
    { name: 'Facts-Protocol-Version', value: '0.1.0' },
    { name: 'Contract-Src', value: FACT_MARKET_SRC },
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Protocol-Name', value: 'Facts' },
    { name: 'Indexed-By', value: 'ucm' },
    ...factRebuts,
  ];
};
