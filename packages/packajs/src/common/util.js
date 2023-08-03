import chalk from 'chalk';
import { promises } from 'fs';
import * as path from 'path';

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

export async function mkdir() {
  try {
    const newDirectoryName = '.packajs';

    // Provide the desired directory path as the first argument to mkdir
    const newDirectoryPath = path.join(__dirname, newDirectoryName);

    // The `mkdir` method returns a promise, so we can use `await` to wait for the result.
    await promises.mkdir(newDirectoryPath);

    console.log('Directory created successfully!');
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('EXISTS!');
      return;
    } else {
      console.log(chalk.red(error?.message || 'An error occurred.'));
      process.exit();
    }
  }
}
