import fs from 'fs';
import path from 'path';
import NodeBundlr from '@bundlr-network/client/node';

const buildPath = './dist';

const jwk = JSON.parse(
  fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
);

if (!process.argv[2]) {
  console.error('Please pass a file to the script.');
  process.exit();
}

renameFile(buildPath);
const tags = [{ name: 'Content-Type', value: 'application/x-compressed' }];

console.log(process.cwd());
fs.readdir(`${process.cwd()}/dist`, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // 'files' is an array containing the names of files and directories in the specified directory
  console.log('Contents of the directory:');
  files.forEach((file) => {
    console.log(file);
  });
});

// const bundlr = new NodeBundlr('http://node2.bundlr.network', 'arweave', jwk);
// const response = await bundlr.uploadFile(`${buildPath}/package.tgz`, tags);
// console.log(`File uploaded ==> https://arweave.net/${response.id}`);

function renameFile(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const fileExt = path.extname(file);

      if (fileExt === '.tgz') {
        const newFileName = 'package.tgz'; // Replace '.new-extension' with your desired new extension.

        const newFilePath = path.join(directoryPath, newFileName);

        fs.rename(filePath, newFilePath, (err) => {
          if (err) {
            console.error('Error renaming file:', err);
          } else {
            console.log(`${file} renamed to ${newFileName}`);
          }
        });
      }
    });
  });
}
