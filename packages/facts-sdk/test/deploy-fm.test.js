import { suite } from "uvu";
import * as assert from "uvu/assert";

import * as fs from "fs";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";

import { deploy } from "../src/api/deploy-fm.js";
import { getWarp } from "../test-tools/warp.js";

const test = suite("deploy-fm");

const jwk = JSON.parse(
  fs.readFileSync(process.env["PATH_TO_WALLET"]).toString()
);

test.skip("deploy-fm", async () => {
  const warp = getWarp();
  const tx = await deploy({
    warp,
    signer: new ArweaveSigner(jwk),
    deployPlugin: new DeployPlugin(),
  })({
    tags: {
      type: "test",
      title: "Test Fact Market",
      description: "Testing Fact Markets",
      renderWith: "renderer",
      topics: [],
    },
    extraTags: [{ name: "Some", value: "Tag" }],
    rebutTx: "test",
    data: "test fact market data",
    position: "support",
  });

  console.log("Deployed Tx:", tx);
  assert.is(tx.length, 43);
});

test.run();
