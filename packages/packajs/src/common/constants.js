export const ARNS_REGISTRY = 'bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U'; // This is the production ArNS Registry Smartweave Contract
export const ANT_SOURCE = 'PEI1efYrsX08HUwvc6y-h6TSpsNlo2r6_fWL2_GdwhY'; // This is the ANT Smartweave Contract TX ID
export const nameToBuy = 'test-domain-packajs'; // This is the name we want to buy from ArNS
export const MAX_ARNS_NAME_LENGTH = 32; // This is the maximum length of an ArNS name
export const DRE_URL = 'https://dre-3.warp.cc';

export const DEFUULT_MANIFEST = {
  manifest: 'arweave/paths',
  version: '0.1.0',
  index: {
    path: 'index.html',
  },
  paths: {
    readme: {
      id: 'HsLim8nzzAeyJBLtSVBDp8tM0EW_ZMWrFqtR7hyaToc',
    },
    '*': {
      id: 'HsLim8nzzAeyJBLtSVBDp8tM0EW_ZMWrFqtR7hyaToc',
    },
  },
};

export const DEFUULT_CONFIG = {
  manifest: true,
  ant: {
    tx: '',
    undername: '',
  },
  pack: false,
  readme: 'HsLim8nzzAeyJBLtSVBDp8tM0EW_ZMWrFqtR7hyaToc',
  manual: {
    manifest:
      'The path manifest for the deployment. (see: https://specs.arweave.dev/#/view/lXLd0OPwo-dJLB_Amz5jgIeDhiOkjXuM3-r0H_aiNj0)',
    ant: 'The tx ID of the ARNS ANT. (see: https://ar.io/arns-pilot/)',
    pack: 'Tells the cli whether or not to run npm pack in the ./dist folder.  You can also pass --pack to the cli to specify a directory to pack.',
    readme:
      'The txid of the readme file (could be anything, a video, docs, etc.).  This will be the root path of the manifest and will show at (https://<your-ant>.arweave.dev.',
  },
};
