import fs from 'fs';
import NodeBundlr from '@bundlr-network/client/node';

const jwk = JSON.parse(
  fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
);

const tags = [
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Data-Protocol', value: 'pbj' },
];

const bundlr = new NodeBundlr('http://node2.bundlr.network', 'arweave', jwk);
const response = await bundlr.upload(
  JSON.stringify({
    peanutbutter: 'chunky',
    jelly: 'strawberry',
    bread: 'wheat',
  }),
  { tags }
);
console.log(`File uploaded ==> https://arweave.net/${response.id}`);
