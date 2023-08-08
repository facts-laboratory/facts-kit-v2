#!/usr/bin/env node
import { program } from 'commander';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';
import * as fs from 'fs';
import { pubjs } from './api/pubjs.js';
// @ts-ignore
import Arweave from 'arweave';
// @ts-ignore
import packageJson from '../package.json' assert { type: 'json' };
// import { ArNs } from './api/arns.js';
import { init } from './api/init.js';
import chalk from 'chalk';

program.version(packageJson.version);

const arweave = Arweave.init({
  protocol: 'https',
  host: 'arweave.net',
});

program
  .command('fetch-url <url>')
  .option('-n, --name <name>', 'Your name.')
  .option('-t, --tag <tag...>', 'Additional tags.', [])
  .description('Run an HTTP request to the specified URL using fetch.')
  .action(async (url, options) => {
    console.log(url, options);
  });

program
  .command('init')
  .description('Initializes packajs configuration.')
  .action(async () => init({ promises: fs.promises })());

program
  .command('pubjs')
  .option('-arns, --arns', 'Flag for updating ARNS.')
  .option('-t, --tag <tag...>', 'Additional tags.', [])
  .option('-f, --file <file>', 'Path to the file to deploy.')
  .option(
    '-w, --wallet <wallet>',
    'Path to the arweave key file.',
    process.env.PATH_TO_WALLET
  )
  .description('Publish a file and optionally assign it an ARNS name.')
  .action(async (options) => {
    if (!options?.wallet) {
      console.error(
        chalk.red(
          'Wallet is required. Pass the path to your wallet with -w or --wallet.'
        )
      );
      process.exit();
    }
    const bundlr = new NodeBundlr(
      'http://node2.bundlr.network',
      'arweave',
      JSON.parse(fs.readFileSync(options.wallet).toString())
    );

    return pubjs({
      bundlr,
      promises: fs.promises,
      version: packageJson.version,
      arweave,
    })(options);
  });

// program
//   .command('arns <name>')
//   .option(
//     '-a, --available <available>',
//     'Checks if the arns name passed is available.'
//   )
//   .option('-r, --register <register>', 'Registers the ARNS name.')
//   .option('-l, --list <list>', 'Lists all domains owned by the current wallet.')
//   .option('-w, --wallet <wallet>', 'Path to the arweave key file.')
//   .option('-tx, --tx <tx>', 'Resource transaction id.')
//   .description('Checks if an arns name is available and can register it.')
//   .action(async (name, options) => {
//     return ArNs(name, options.tx, wallet, warp, arweave)(options);
//   });

program.parse(process.argv);
