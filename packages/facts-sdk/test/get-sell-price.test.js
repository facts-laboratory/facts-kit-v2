import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getSellPrice } from '../src/api/get-sell-price.js';
import { getWarp } from '../test-tools/warp.js';

const test = suite('get-sell-price');

test('get-sell-price2', async () => {
  const warp = getWarp();
  const output = await getSellPrice(warp)({
    qty: 2,
    tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
    position: 'support',
  });

  const { u, position } = output;

  assert.is(Number.isInteger(u), true);
  assert.is(position, 'support');
});

test('get-sell-price', async () => {
  try {
    const warp = getWarp();
    await getSellPrice(warp)({
      qty: 1,
      tx: 'Lx9D-z44-a-yRF-dbSPTgKf_T1X8x_Vl0aB00SdmMrI',
      position: 'oppose',
    });
    assert.unreachable();
  } catch (error) {
    assert.is(error.message, 'Supply is less than quantity.');
  }
});

test.run();
