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
    tx: 'pMcG0SxcxscxFpRoB4ywsiU8ut1qSwGKgrPpYGjv-OU',
    position: 'oppose',
  });
  const read = await warp
    .contract('pMcG0SxcxscxFpRoB4ywsiU8ut1qSwGKgrPpYGjv-OU')
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-4.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .readState();

  const state = await read.cachedValue.state;
  console.log('State', state);
  assert.is(Number.isInteger(state.creator_cut), true);
});

test.run();
