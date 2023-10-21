import { suite } from "uvu";
import * as assert from "uvu/assert";

import { WarpFactory } from "warp-contracts";

import { getPrice } from "../src/api/get-price.js";

const test = suite("get-price");

test.skip("get-price", async () => {
  const warp = WarpFactory.forMainnet();
  const output = await getPrice(warp)({
    qty: 1,
    tx: "OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY",
    position: "oppose",
  });
  assert.is(output.position, "oppose");
});

test.run();
