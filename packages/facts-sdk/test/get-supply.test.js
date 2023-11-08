import { suite } from "uvu";
import * as assert from "uvu/assert";

import { getSupply } from "../src/api/get-supply.js";
import { getWarp } from "../test-tools/warp.js";

const test = suite("get-supply");

test("get-supply", async () => {
  const warp = getWarp();
  const output = await getSupply(warp)({
    tx: "OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY",
  });
  const { result } = output;
  assert.is(Number.isInteger(result.total), true);
  assert.is(Number.isInteger(result.support), true);
  assert.is(Number.isInteger(result.oppose), true);
});

test.run();
