import { suite } from "uvu";
import * as assert from "uvu/assert";

import { getSellPrice } from "../src/api/get-sell-price.js";
import { getWarp } from "../test-tools/warp.js";

const test = suite("get-sell-price");

test.skip("get-sell-price", async () => {
  const warp = getWarp();
  const output = await getSellPrice(warp)({
    qty: 2,
    tx: "OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY",
    position: "support",
  });

  const { u, position } = output;

  assert.is(Number.isInteger(u), true);
  assert.is(position, "support");
});

test.run();
