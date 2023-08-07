import chalk from 'chalk';
import { promises } from 'fs';
// import * as path from 'path';
import { Rejected, Resolved } from './hyper-async.js';

export async function readFile() {
  try {
    // Provide the file path as the first argument to readFile
    const filePath = './.packajs/manifest.json';

    // The `readFile` method returns a promise, so we can use `await` to wait for the result.
    const fileContent = await promises.readFile(filePath, {
      encoding: 'utf-8',
    });

    // Do something with the file content
    console.log('CONTENTS', fileContent);
  } catch (error) {
    // Handle any errors that might occur during file reading
    console.error('Error reading the file:', error.message);
  }
}

export const hasOptions = (options) => {
  if (!options) return Rejected('There were no options passed to the command.');
  return Resolved(options);
};

export const hasWallet = (options) => {
  if (!options?.wallet)
    return Rejected(
      'Please pass a wallet file to the command. eg. -w /path/to/wallet.json'
    );
  return Resolved(options);
};

export const validateArns = async (options) => {
  console.log(
    chalk.yellow('Validating arns: '),
    options.arns || '<missing arns option>'
  );
  // Make sure the wallet being used owns or controls the ARNS name being updated.
  return options;
};

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 */
export async function getConfig(promises) {
  return promises.readFile('./.packajs/config.json', 'utf-8');
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 */
export async function getManifest(promises) {
  return promises.readFile('./.packajs/manifest.json', 'utf-8');
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 */
export async function getConfigAndManifest(promises) {
  return {
    config: await getConfig(promises),
    manifest: await getManifest(promises),
  };
}

// export async function mkdir() {
//   try {
//     const newDirectoryName = '.packajs';

//     // Provide the desired directory path as the first argument to mkdir
//     const newDirectoryPath = path.join(__dirname, newDirectoryName);

//     // The `mkdir` method returns a promise, so we can use `await` to wait for the result.
//     await promises.mkdir(newDirectoryPath);

//     console.log('Directory created successfully!');
//   } catch (error) {
//     if (error.code === 'EEXIST') {
//       console.log('EXISTS!');
//       return;
//     } else {
//       console.log(chalk.red(error?.message || 'An error occurred.'));
//       process.exit();
//     }
//   }
// }
