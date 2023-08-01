#!/usr/bin/env node
import { program } from 'commander';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';
import { WarpFactory, defaultCacheOptions } from 'warp-contracts';
import * as fs from 'fs';
import { pubjs } from './api/pubjs.js';

// @ts-ignore
import packageJson from '../package.json' assert { type: 'json' };
program.version(packageJson.version);

const wallet = JSON.parse(
  fs.readFileSync(process.env['PATH_TO_WALLET']).toString()
);
const bundlr = new NodeBundlr('http://node2.bundlr.network', 'arweave', wallet);

const warp = WarpFactory.forMainnet(
  { ...defaultCacheOptions, inMemory: true },
  true
);

program
  .command('fetch-url <url>')
  .option('-n, --name <name>', 'Your name.')
  .option('-t, --tag <tag...>', 'Additional tags.', [])
  .description('Run an HTTP request to the specified URL using fetch.')
  .action(async (url, options) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (options.name) {
        console.log(`Hello ${options.name}, here are the results:`, data);
      } else {
        console.log('Results:', data);
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  });

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
  .action(async (options) => pubjs(bundlr, warp, wallet)(options));

program
  .command('arns <name>')
  .option(
    '-a, --available <available>',
    'Checks if the arns name passed is available.'
  )
  .option('-r, --register <register>', 'Registers the ARNS name.')
  .option('-l, --list <list>', 'Lists all domains owned by the current wallet.')
  .description('Checks if an arns name is available and can register it.')
  .action(async (name, options) => {
    console.log('arns', name, options);

    return;
  });

program.parse(process.argv);
