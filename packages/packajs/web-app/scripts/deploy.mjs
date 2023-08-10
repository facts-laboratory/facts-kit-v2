// deploy.mjs
// node ./deploy.mjs

import Bundlr from '@bundlr-network/client/build/esm/node/bundlr';
import { readFileSync } from 'fs';

// eslint-disable-next-line no-undef
const jwk = JSON.parse(readFileSync(process?.env?.PATH_TO_WALLET, 'utf-8'));

const bundlr = new Bundlr('https://node2.bundlr.network', 'arweave', jwk);

// upload folder
const result = await bundlr.uploadFolder('./dist', {
  indexFile: 'index.html',
  // manifestTags: [{ name: 'TagName', value: 'TagValue' }],
});

console.log('Result', result);
