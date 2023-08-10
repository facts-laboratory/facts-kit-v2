#!/usr/bin/env node
import { program } from 'commander';
import prompts from 'prompts';
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
import { setAnt } from './api/config/set-ant.js';
import { setTx, upload } from './api/config/readme.js';
process.env.NO_WARNINGS = 'experimental';

program.version(packageJson.version);

const arweave = Arweave.init({
  protocol: 'https',
  host: 'arweave.net',
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
      arweave,
    })(options);
  });

const config = program.command('config');

config
  .command('set-ant <ant>')
  .option('-n, --name', 'Flag that says the input is a name.')
  .description('Set ant value in config')
  .action((ant, options) => {
    return setAnt({ promises: fs.promises })(ant, options);
  });

config
  .command('readme')
  .option('-t, --tx <tx>', 'A transaction deployed to arweave.')
  .option('-f, --force', 'Force upload')
  .option(
    '-w, --wallet <wallet>',
    'Path to the arweave key file.',
    process.env.PATH_TO_WALLET
  )
  .description(
    'Deploys the README.md file and sets it in ./.packajs/config.json. If the --tx flag is specified, it will set that value in the config.'
  )
  .action(async (options) => {
    if (!options.tx && options.force) {
      if (!options.wallet) {
        console.log(
          chalk.red(
            'Please pass a wallet file to upload with using `-w <path/to/wallet.json>`.'
          )
        );
        process.exit();
      }

      try {
        const bundlr = new NodeBundlr(
          'http://node2.bundlr.network',
          'arweave',
          JSON.parse(fs.readFileSync(options.wallet).toString())
        );
        return upload({ promises: fs.promises, bundlr })();
      } catch (error) {
        console.error(
          chalk.red(
            'There was an error uploading your readme. Is the wallet correct?'
          )
        );
        process.exit();
      }
    }
    if (options.tx) {
      return setTx({ promises: fs.promises })(options.tx);
    } else {
      let isValidInput = false;
      let userResponse;
      let attempts = 0;
      while (!isValidInput) {
        const response = await prompts({
          type: 'text',
          name: 'answer',
          message: chalk.yellow(
            `Do you want to upload your README.md to Arweave? (${chalk.green(
              'y'
            )}/${chalk.red('n')}):`
          ),
          validate: (value) => {
            if (attempts === 2) {
              console.log(chalk.red('Try again.'));
              process.exit();
            }
            attempts++;
            return value === 'y' || value === 'n' || 'Please enter "y" or "n"';
          },
        });

        userResponse = response?.answer?.toLowerCase();
        if (!userResponse) process.exit();
        if (userResponse === 'y' || userResponse === 'n') {
          isValidInput = true;
        }
      }

      if (userResponse === 'y') {
        if (!options.wallet) {
          console.log(
            chalk.red(
              'Please pass a wallet file to upload with using `-w <path/to/wallet.json>`.'
            )
          );
          process.exit();
        }

        try {
          const bundlr = new NodeBundlr(
            'http://node2.bundlr.network',
            'arweave',
            JSON.parse(fs.readFileSync(options.wallet).toString())
          );
          return upload({ promises: fs.promises, bundlr })();
        } catch (error) {
          console.error(
            chalk.red(
              'There was an error uploading your readme. Is the wallet correct?'
            )
          );
          process.exit();
        }
      } else {
        console.log(chalk.yellow('Goodbye.'));
        process.exit();
      }
    }
  });

config
  .command('contrib')
  .option('-t, --tx <tx>', 'A transaction deployed to arweave.')
  .description(
    'Deploys the CONTRIBUTING.md file and sets it in ./.packajs/config.json. If the --tx flag is specified, it will set that value in the config.'
  )
  .action((contribValue) => {
    console.log(`Setting contrib to: ${contribValue}`);
    // Implement your logic to set the contrib value in the config here
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
