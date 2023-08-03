import { promises } from 'fs';

async function readFileExample() {
  try {
    // Provide the file path as the first argument to readFile
    const filePath = './';

    // The `readFile` method returns a promise, so we can use `await` to wait for the result.
    const fileContent = await promises.readFile(filePath, {
      encoding: 'utf-8',
    });

    // Do something with the file content
    console.log(fileContent);
  } catch (error) {
    // Handle any errors that might occur during file reading
    console.error('Error reading the file:', error.message);
  }
}
