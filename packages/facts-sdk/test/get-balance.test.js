import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getBalance } from '../src/api/get-balance.js';
import { getWarp } from '../test-tools/warp.js';

const test = suite('get-balance');

test('get-balance', async () => {
  const warp = getWarp();
  const target = '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4';
  const output = await getBalance(warp)({
    tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
    target,
  });
  const { result } = output;
  assert.is(result.target, target);
  assert.is(Number.isInteger(result?.balances?.support), true);
  assert.is(Number.isInteger(result?.balances?.oppose), true);
});

test.run();
