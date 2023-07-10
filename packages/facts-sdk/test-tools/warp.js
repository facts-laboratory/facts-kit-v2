import { WarpFactory } from 'warp-contracts';

export function getWarp() {
  if (globalThis?.warp) return globalThis.warp;
  globalThis.warp = WarpFactory.forMainnet();
  return globalThis.warp;
}
