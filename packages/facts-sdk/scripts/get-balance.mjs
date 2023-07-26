import { WarpFactory } from 'warp-contracts';
const warp = WarpFactory.forMainnet();

if (!process.argv[2]) {
  console.error('Please pass a contract id to the script.');
  process.exit();
}

const target = '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4';
const view = await warp
  .contract(process.argv[2])
  .setEvaluationOptions({
    remoteStateSyncSource: `https://dre-4.warp.cc/contract`,
    remoteStateSyncEnabled: true,
    internalWrites: true,
    allowBigInt: true,
    unsafeClient: 'skip',
  })
  .viewState({
    function: 'balance',
    target,
  });

console.log('Result', view.result);
