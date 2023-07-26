import { WarpFactory } from 'warp-contracts';
const warp = WarpFactory.forMainnet();
const state = (
  await warp
    .contract('KTzTXT_ANmF84fWEKHzWURD1LWd9QaFR9yfYUwH2Lxw')
    .setEvaluationOptions({
      remoteStateSyncSource: `https://dre-5.warp.cc/contract`,
      remoteStateSyncEnabled: true,
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'skip',
    })
    .readState()
).cachedValue.state;

console.log('State', state);
