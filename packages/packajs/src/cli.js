#!/usr/bin/env node
import { program } from 'commander';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';
import * as fs from 'fs';
import { pubjs } from './api/pubjs.js';
import Arweave from 'arweave';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

// @ts-ignore
import packageJson from '../package.json' assert { type: 'json' };
import { ArNs } from './api/arns.js';
import { init } from './api/init.js';

program.version(packageJson.version);

const wallet = JSON.parse(
  fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
);
const bundlr = new NodeBundlr('http://node2.bundlr.network', 'arweave', wallet);

// ~~ Initialize Arweave ~~
const arweave = Arweave.init({
  host: 'arweave.net',
  timeout: 600000,
  port: 443,
  protocol: 'https',
});

const warp = WarpFactory.forMainnet({ ...defaultCacheOptions }, true).use(
  new DeployPlugin()
);

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
  .option(
    '-arns, --arns <arns>',
    '(COMING SOON) The ARNS name to assign the tx to.'
  )
  .option(
    '-p, --path <path>',
    '(COMING SOON) The path in the manifest. eg. https://<arns>.g8way.io/<path>'
  )
  .option('-t, --tag <tag...>', 'Additional tags.', [])
  .option('-f, --file <file>', 'Path to the file to deploy.')
  .option('-w, --wallet <wallet>', 'Path to the arweave key file.')
  .description('Publish a file and optionally assign it an ARNS name.')
  .action(async (options) => {
    // if(!process.env.PATH_TO_WALLET) {
    //   console.error('Please set your arweave wallet file path to the environm')
    // }
    const bundlr = new NodeBundlr(
      'http://node2.bundlr.network',
      'arweave',
      JSON.parse(fs.readFileSync(process.env['PATH_TO_WALLET']).toString())
    );

    return pubjs({
      bundlr,
      promises: fs.promises,
      version: packageJson.version,
    })(options);
  });

program
  .command('arns <name>')
  .option(
    '-a, --available <available>',
    'Checks if the arns name passed is available.'
  )
  .option('-r, --register <register>', 'Registers the ARNS name.')
  .option('-l, --list <list>', 'Lists all domains owned by the current wallet.')
  .option('-w, --wallet <wallet>', 'Path to the arweave key file.')
  .option('-tx, --tx <tx>', 'Resource transaction id.')
  .description('Checks if an arns name is available and can register it.')
  .action(async (name, options) => {
    return ArNs(name, options.tx, wallet, warp, arweave)(options);
  });

program.parse(process.argv);
