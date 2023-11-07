// @ts-nocheck
import Async, {
  // Rejected,
  // Resolved,
  fromPromise,
} from "../../common/hyper-async.js";
import chalk from "chalk";
import fetch from "node-fetch";
import extract from "extract-zip";
import * as path from "path";
/**
 * Downloads a zip file from a specified URL, extracts its contents, and saves them in a folder named "app".
 * @param {Object} options - An object containing options for the function.
 * @param {typeof import('fs').promises} options.promises - The 'fs.promises' module for handling file system operations.
 * @throws {Error} Throws an error if there is a problem with the HTTP request, file operations, or extraction.
 */
export function renderer({ promises }) {
  /**
   * Sets the ant.tx in the config.
   */
  return async () => {
    return Async.of(undefined)
      .chain(() => fromPromise(createFolder)(promises))
      .chain(() => fromPromise(fetchZip)())
      .chain((data) => fromPromise(unzipAndCleanup)({ data, promises }))
      .fork(
        (error) => {
          if (error?.message?.includes("config.json")) {
            console.error(
              chalk.red("Config not found. Please run the `init` function.")
            );
            process.exit();
          }
          console.error(
            chalk.red(error?.message || error || "An error occurred.")
          );
          process.exit();
        },
        () => {
          console.log(chalk.green("Success"));
        }
      );
  };
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {typeof import('fs').promises} promises
 */
async function createFolder(promises) {
  // Define the folder name for extraction
  // const exists = await promises.stat("app");
  // if (exists) throw new Error("Directory `app` already exists.");

  await promises.mkdir("renderer");
}

async function fetchZip() {
  const zipUrl =
    "https://arweave.net/EBsPKJr_PpnmnFeqCpfW3Z9Lz0SI3bitSDlBFIQ1qH8";

  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.arrayBuffer();
}

/**
 * @param {Object} options - An object containing options for the function.
 * @param {typeof import('fs').promises} options.promises - The 'fs.promises' module for handling file system operations.
 * @param {any} options.data - The 'fs.promises' module for handling file system operations.
 *
 *
 * @author @jshaw-ar
 */
async function unzipAndCleanup({ data, promises }) {
  await promises.writeFile("downloaded.zip", Buffer.from(data));
  await extract("downloaded.zip", { dir: path.resolve("renderer") });
  await promises.unlink("downloaded.zip");
}
