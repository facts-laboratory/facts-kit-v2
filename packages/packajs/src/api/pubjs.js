import Async, {
  Rejected,
  Resolved,
  fromPromise,
} from "../common/hyper-async.js";
import NodeBundlr from "@bundlr-network/client/build/esm/node/bundlr";
import chalk from "chalk";
import {
  getFiles,
  getSetRecordTags,
  hasOptions,
  hasWallet,
  validateArns,
} from "../common/util.js";

import fetch from "node-fetch";

/**
 * @typedef {Object} PublishOptions
 * @property {string} arns - The ARNs (Amazon Resource Names) associated with the file.
 * @property {string} path - The path where the JavaScript file will be published.
 * @property {string} wallet - The path to the wallet
 * @property {Array<string>} tag - An array of tags to attach to the published file.
 * @property {Array<{name: string; value: string}>} [tags] - An array of tags to attach to the published file.
 * @property {string} file - The content of the JavaScript file to be published.
 * @property {*} [manifest] - The content of the JavaScript file to be published.
 * @property {*} [config] - The content of the JavaScript file to be published.
 * @property {string} [tx] - The content of the JavaScript file to be published.
 * @property {Object} [packageJson] - The package.json of the package.
 */

/**
 *
 *
 * @author @jshaw-ar
 * @export
 * @param {*} options
 */
export function pubjs({ bundlr, promises, arweave }) {
  /**
   * Publishes a file to the permaweb.
   * @param {PublishOptions} options The options for publishing the JavaScript file.
   */
  return async (options) =>
    Async.of(promises)
      .chain(fromPromise(getFiles))
      .chain(validateConfig)
      .chain((object) => fromPromise(validateInput)(options, object))
      .chain((options) => fromPromise(getTgz)(options, promises))
      .chain((/** @type {PublishOptions} */ options) =>
        fromPromise(publishPackage)(bundlr, options)
      )
      .chain((options) =>
        fromPromise(createManifest)(bundlr, promises, options)
      )
      .chain(({ manifest, options }) =>
        fromPromise(publishManifest)(bundlr, manifest, options)
      )
      .chain((options) => fromPromise(updateArns)(options, arweave, promises))
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
}

const validateConfig = (object) => {
  const { config, manifest, packageJson } = object;

  if (!config?.readme)
    return Rejected(
      "Please deploy a markdown readme and add it to your config file. (or use packajs readme when available)"
    );

  if (!manifest?.paths)
    return Rejected("Could not find `paths` in your manifest file.");

  if (!packageJson?.version)
    return Rejected("Could not find `version` in your package.json file.");
  return Resolved(object);
};

/**
 * Validates the input.
 * @param {PublishOptions} options - The options for publishing the JavaScript file.
 * @param {{config: any; manifest: any}} object - The packajs object (manifest.json && config.json)
 */
const validateInput = async (options, object) => {
  return Async.of(options)
    .chain(hasOptions)
    .chain(hasWallet)
    .chain((options) => validateArns(options, object))
    .chain((options) => validateTags(options.tag))
    .map((tags) => ({
      ...options,
      tags,
      ...object,
    }))
    .toPromise();
};

const validateTags = (tags) => {
  for (const t of tags) {
    const kv = t.split("=");
    if (kv.length !== 2) {
      return Rejected(
        `Invalid tag "${t}". A valid tag is -t key=value or --tag key=value.`
      );
    }
  }
  const packajsTags = [
    { name: "Data-Protocol", value: "Permanent-Package" },
    { name: "Programming-Lang", value: "javascript" },
  ];
  return Resolved([
    ...tags.map((t) => {
      const kv = t.split("=");
      return {
        name: kv[0],
        value: kv[1],
      };
    }),
    ...packajsTags,
  ]);
};

async function getTgz(options, promises) {
  if (options.file) {
    return options;
  }
  return promises
    .readdir("./dist")
    .then((files) => {
      const tgz = files.filter((f) => f.includes(".tgz"))[0];
      if (!tgz)
        throw new Error(
          "There is no .tgz file to publish in the ./dist folder. Run npm pack in your dist folder.\n\nOptionally, you can pass a file path to publish directly to the command using -f /path/to/file."
        );

      return { ...options, file: `./dist/${tgz}` };
    })
    .catch((err) => {
      throw new Error(err.message || "An error occurred.");
    });
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {NodeBundlr} bundlr
 * @param {PublishOptions} options The options for publishing the JavaScript file.
 *
 */
async function publishPackage(bundlr, options) {
  console.log(chalk.yellow("Uploading package."));
  const tags = [{ name: "Name", value: "Package" }, ...(options.tags || [])];
  const response = await bundlr.uploadFile(options.file, {
    tags,
  });
  console.log(
    `${chalk.green("Package uploaded")} ==> ${chalk.underline(
      `https://arweave.net/${response.id}`
    )}`
  );

  return { ...options, tx: response.id };
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {NodeBundlr} bundlr
 * @param {typeof import('fs').promises} promises
 * @param {PublishOptions} options The options for publishing the JavaScript file.
 *
 */
async function createManifest(bundlr, promises, options) {
  console.log(chalk.yellow("Creating new manifest."));
  const config = options.config;
  const manifest = options.manifest;
  const version = options?.packageJson?.version;
  const filteredPaths = Object.fromEntries(
    Object.entries(manifest.paths).filter((t) => /^\d+\.\d+\.\d+$/.test(t[0]))
  );

  const paths = {
    ...filteredPaths,
    readme: {
      id: config?.readme || "HsLim8nzzAeyJBLtSVBDp8tM0EW_ZMWrFqtR7hyaToc",
    },
    latest: {
      id: options.tx,
    },
    [version]: {
      id: options.tx,
    },
  };

  const tags = [{ name: "Content-Type", value: "application/json" }];

  const response = await bundlr.upload(
    JSON.stringify({
      ...manifest,
      paths,
    }),
    {
      tags,
    }
  );

  const newJs = await getJs("kxDTrlMDpVKnKI37gO4AeuW6S-R4kcF_gHSFD4of0rA");

  const newJsResponse = await bundlr.upload(
    newJs.replace(
      "https://packajs.arweave.dev/manifest",
      `https://arweave.net/${response.id}`
    ),
    {
      tags: [
        {
          name: "Content-Type",
          value: "application/javascript; charset=utf-8",
        },
      ],
    }
  );

  console.log(
    `${chalk.green("js file uploaded uploaded")} ==> ${chalk.underline(
      `https://arweave.net/${newJsResponse.id}`
    )}`
  );

  const APP_PATHS = {
    "vite.svg": { id: "JI1vtONYd5AOoPGojbx6cIunUyILn8kjuFJP7uEDvwc" },
    "index.html": { id: "RYRIn4ws7U16fQPi9NynaOsrsW-3t0m4sa_Y1jcqf9I" },
    "assets/index-70c30a7d.css": {
      id: "5y-AED1U9M52yyKB3cHhgQ08OkB1PqUgmB5FOQk7iXM",
    },
    "assets/index-535a2489.js": {
      id: newJsResponse.id,
    },
  };

  const newManifest = {
    ...manifest,
    paths: {
      ...paths,
      ...APP_PATHS,
      manifest: {
        id: response.id,
      },
    },
  };

  await promises.writeFile(
    "./.packajs/manifest.json",
    JSON.stringify(newManifest, null, 2)
  );

  return { manifest: newManifest, options };
}

/**
 *
 *
 * @author @jshaw-ar
 * @param {NodeBundlr} bundlr
 * @param {*} manifest The new manifest.
 *
 */
async function publishManifest(bundlr, manifest, options) {
  console.log(chalk.yellow("Uploading manifest."));
  const config = options?.config;
  const tags = [
    ...options.tags,
    { name: "Content-Type", value: "application/x.arweave-manifest+json" },
    { name: "Name", value: "Manifest" },
  ];

  const response = await bundlr.upload(JSON.stringify(manifest), {
    tags,
  });
  console.log(
    `${chalk.bgGreen("Manifest uploaded")} ==> ${chalk.underline(
      `https://arweave.net/${response.id}`
    )}`
  );

  return {
    tx: response.id,
    ant: config?.ant?.tx,
    arns: options.arns,
    wallet: options?.wallet,
  };
}

async function updateArns({ tx, ant, arns, wallet }, arweave, promises) {
  if (arns) {
    if (!ant) {
      throw new Error("Please configure your ANT in the config file.");
    }

    console.log(chalk.yellow("Updating ARNS."));

    const jwk = JSON.parse(await promises.readFile(wallet, "utf-8"));

    const transaction = await arweave.createTransaction(
      {
        data: "packajs",
      },
      jwk
    );

    // add a custom tag that tells the gateway how to serve this data to a browser
    transaction.addTag("Content-Type", "text/plain");

    const tags = getSetRecordTags(ant, tx);

    for (let i = 0; i < tags.length; i++) {
      transaction.addTag(tags[i].name, tags[i].value);
    }

    // you must sign the transaction with your jwk before posting
    await arweave.transactions.sign(transaction, jwk);
    const response = await arweave.transactions.post(transaction);

    if (response?.status !== 200) {
      throw new Error(
        response?.statusText || "There was an error updating your ARNS name."
      );
    }
    console.log(
      `${chalk.green(
        "ARNS updated.  Please wait for the L1 transaction to confirm."
      )} ==> ${chalk.underline(`https://arweave.net/${transaction.id}`)}`
    );

    return transaction.id;
  }
  console.log(chalk.yellow("Not updating ARNS."));
  return tx;
}

async function getJs(tx) {
  const response = await fetch(`https://arweave.net/${tx}`);

  if (!response.ok) {
    throw new Error("There was an issue fetching the app file.");
  }
  return response.text();
}
