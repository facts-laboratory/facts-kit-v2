import fs from 'fs';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';

const jwk = JSON.parse(
  fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
);

if (!process.argv[2]) {
  console.error('Please pass a file to the script.');
  process.exit();
}
const tags = [{ name: 'Content-Type', value: 'application/x-compressed' }];

const bundlr = new NodeBundlr('http://node2.bundlr.network', 'arweave', jwk);
const response = await bundlr.uploadFile(process.argv[2], tags);
console.log(`File uploaded ==> https://arweave.net/${response.id}`);
