import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as fs from 'fs';

import { buy } from '../src/api/buy.js';
import { getWarp } from '../test-tools/warp.js';

const test = suite('buy');

const jwk = JSON.parse(
  fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
);

test('buy', async () => {
  const warp = getWarp();
  await buy({ warp, signer: jwk })({
    qty: 1,
    tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
    position: 'support',
  });
  const read = await warp
    .contract('OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY')
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-3.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .readState();

  const state = await read.cachedValue.state;
  assert.is(Number.isInteger(state.creator_cut), true);
});

test.run();
