import fs from 'fs';
import NodeBundlr from '@bundlr-network/client/node';

const jwk = JSON.parse(
  fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
);

// test-arns-bug-v001
const ANT = 'bDzLUNOCMOEcaXRyuGtg10-yPXnY-YS2cTpDIMQV3Og';
// test-domain-packajs
// const ANT = 'bDzLUNOCMOEcaXRyuGtg10-yPXnY-YS2cTpDIMQV3Og';
const tx1 = 'm0yYxJR0q4LhgAIvkMAftrbupKhDJcojGkRbKJp8Mr0'; // App
const tx2 = 'kSGwKjy0hwpanOFEFweWw5MLZ1zCgLx4q1JaEUKk7DY'; // Readme

const updateRecordTags = (contractId, tx) => {
  return [
    {
      name: 'App-Name',
      value: 'SmartWeaveAction',
    },
    {
      name: 'App-Version',
      value: '0.3.0',
    },
    {
      name: 'SDK',
      value: 'Warp',
    },
    {
      name: 'Contract',
      value: contractId,
    },
    {
      name: 'Input',
      value: `{"function":"setRecord","subDomain":"@","transactionId":"${tx}"}`,
    },
    {
      name: 'Signing-Client',
      value: 'ArConnect',
    },
    {
      name: 'Signing-Client-Version',
      value: '0.5.3',
    },
  ];
};
const tags = updateRecordTags(ANT, tx2);
const bundlr = new NodeBundlr('http://node2.bundlr.network', 'arweave', jwk);
const response = await bundlr.upload('packajs', { tags });
console.log(`File uploaded ==> https://arweave.net/${response.id}`);
