import { suite } from "uvu";
import * as assert from "uvu/assert";

import { getPrice } from "../src/api/get-price.js";
import { getWarp } from "../test-tools/warp.js";

const test = suite("get-price");

test.skip("get-price", async () => {
  const warp = getWarp();
  const output = await getPrice(warp)({
    qty: 1,
    tx: "OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY",
    position: "oppose",
  });

  const { result } = output;
  assert.is(result.position, "oppose");
});

test.run();
