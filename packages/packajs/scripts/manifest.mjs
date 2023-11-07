const url =
  'https://arweave.net/raw/irlMXzWyZxmAJiEu0c2uam51uUlqUy7IbuwcirRN63M';
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.arrayBuffer();
  })
  .then((arrayBuffer) => {
    const textDecoder = new TextDecoder('utf-8');
    const jsonText = textDecoder.decode(arrayBuffer);
    const jsonData = JSON.parse(jsonText);
    console.log(jsonData);
  })
  .catch((error) => {
    console.error('Fetch error:', error);
  });

// import fs from 'fs';
// import NodeBundlr from '@bundlr-network/client/node';

// const jwk = JSON.parse(
//   fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
// );

// const tags = [
//   { name: 'Content-Type', value: 'application/x.arweave-manifest+json' },
// ];

// const bundlr = new NodeBundlr('http://node2.bundlr.network', 'arweave', jwk);
// const response = await bundlr.upload(
//   JSON.stringify({
//     manifest: 'arweave/paths',
//     version: '0.1.0',
//     index: {
//       path: 'readme',
//     },
//     paths: {
//       readme: {
//         id: 'kSGwKjy0hwpanOFEFweWw5MLZ1zCgLx4q1JaEUKk7DY',
//       },
//       '0.0.2': {
//         id: 'kWXhgcqXu_DKL5kpQ7TlM3qM6YUx9Acoc-fnFFRWJC4',
//       },
//       latest: {
//         id: 'kWXhgcqXu_DKL5kpQ7TlM3qM6YUx9Acoc-fnFFRWJC4',
//       },
//       '*': {
//         id: 'kSGwKjy0hwpanOFEFweWw5MLZ1zCgLx4q1JaEUKk7DY',
//       },
//     },
//   }),
//   tags
// );
// console.log(`File uploaded ==> https://arweave.net/${response.id}`);
