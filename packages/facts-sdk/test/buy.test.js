import { suite } from "uvu";
import * as assert from "uvu/assert";
import * as fs from "fs";

import { buy } from "../src/api/buy.js";
import { getWarp } from "../test-tools/warp.js";

const test = suite("buy");

const jwk = JSON.parse(
  fs.readFileSync(process.env["PATH_TO_WALLET"]).toString()
);

test("buy", async () => {
  const warp = getWarp();
  await buy({ warp, signer: jwk })({
    qty: 1,
    tx: "2xzmM89Umo7haVsXnScXXssYJEeI0NEH6HTv4Rhy79I",
    position: "oppose",
  });
  const read = await warp
    .contract("2xzmM89Umo7haVsXnScXXssYJEeI0NEH6HTv4Rhy79I")
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-u.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: "skip",
    })
    .readState();

  const state = await read.cachedValue.state;
  console.log("State", state);
  assert.is(Number.isInteger(state.creator_cut), true);
});

test.run();
