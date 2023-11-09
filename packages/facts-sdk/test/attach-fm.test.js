import { suite } from "uvu";
import * as assert from "uvu/assert";

import * as fs from "fs";
import { DeployPlugin, ArweaveSigner } from "warp-contracts-plugin-deploy";

import { attach } from "../src/api/attach-fm.js";
import { getWarp } from "../test-tools/warp.js";

const test = suite("attach-fm");

const jwk = JSON.parse(
  fs.readFileSync(process.env["PATH_TO_WALLET"]).toString()
);

test.skip("attach-fm", async () => {
  const warp = getWarp();
  const output = await attach({
    warp,
    signer: new ArweaveSigner(jwk),
    deployPlugin: new DeployPlugin(),
    env: "node",
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
    attachToTx: "RZlH3NT_rTu9CLXGGhGDjnfxbCOOWfCNcGK3-tEjE0U",
  });
});

test.run();
