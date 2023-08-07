#!/usr/bin/env node
import { program } from 'commander';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';
import * as fs from 'fs';
import { pubjs } from './api/pubjs.js';

// @ts-ignore
import packageJson from '../package.json' assert { type: 'json' };
import { init } from './api/init.js';

program.version(packageJson.version);

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
  .action(async (url, options) => init({ promises: fs.promises })());

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

program.parse(process.argv);
