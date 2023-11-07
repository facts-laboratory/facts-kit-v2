import { WarpFactory } from "warp-contracts";
const warp = WarpFactory.forMainnet();

if (!process.argv[2]) {
  console.error("Please pass a contract id to the script.");
  process.exit();
}

const view = await warp
  .contract(process.argv[2])
  .setEvaluationOptions({
    remoteStateSyncSource: `https://dre-u.warp.cc/contract`,
    remoteStateSyncEnabled: true,
    internalWrites: true,
    allowBigInt: true,
    unsafeClient: "skip",
  })
  .viewState({
    function: "get-supply",
  });

console.log("Result", view.result);
