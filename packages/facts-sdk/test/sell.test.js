import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import * as fs from 'fs';

import { sell } from '../src/api/sell.js';
import { getWarp } from '../test-tools/warp.js';

const test = suite('sell');

const jwk = JSON.parse(
  fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
);

test('sell', async () => {
  const warp = getWarp();
  const tx = await sell({
    warp,
    signer:
      jwk /* <-- new InjectedArweaveSigner(window.arweaveWallet) see: https://docs.warp.cc/docs/sdk/advanced/plugins/signature */,
    env: 'node',
  })({
    qty: 4,
    tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
    position: 'support',
  });

  assert.is(tx.length, 43);
});

test.run();
