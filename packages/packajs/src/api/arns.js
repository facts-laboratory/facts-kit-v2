/**
 * This file should
 * 1. Check if arns is available if the --available is passed as an option
 * 2. register the arns name if --register is passed as an option.
 */

import chalk from 'chalk';
import Async, { fromPromise } from '../common/hyper-async.js';
import { getArnsTags, hasOptions, hasWallet, validateArns } from '../common/util.js';
import fetch from 'node-fetch';
import NodeBundlr from '@bundlr-network/client/build/esm/node/bundlr';
const { ARNS_REGISTRY, DRE_URL, ANT_SOURCE } = require("../common/constants");



/**
 * @typedef {Object} PublishOptions
 * @property {string} arns - The ARNs (Amazon Resource Names) associated with the file.
 * @typedef {NodeBundlr} bundlr
 */



/**
 *
 * @param {string} name The name of the ARNS
 * @param {NodeBundlr} bundlr The bundlr instance.
 * @param {string} tx The transaction id of the resource.
 */
export function ArNs(name, bundlr, tx) {
    /**
    * check if the arns name is available then register it. 
    * @param {PublishOptions} options The options for publishing the JavaScript file. 
    */
    return async (options) =>
        Async.of(options)
            .chain(fromPromise(validateInput))
            .chain((/** @type {PublishOptions} */ options) =>
                fromPromise(checkArnsExistence)(name, options)
            )
            .chain((/** @type {PublishOptions} */ options) => {
                return fromPromise(registerArns)(name, bundlr, tx)
            }
            )
            .fork(
                (error) => {
                    console.error(
                        chalk.red(error?.message || error || 'An error occurred.')
                    );
                    process.exit();
                },
                (output) => {
                    console.log(
                        chalk.blue("\n\n===========output=============\n") ,
                        chalk.green(output),
                        chalk.blue("\n=============end==============\n\n") ,
                    );
                    return output;
                }
            );
}


const validateInput = async (options) => {
    return Async.of(options)
        .chain(hasOptions)
        .chain(hasWallet)
        .chain(fromPromise(validateArns))
        .toPromise();
};

/**
 * @param {string} name The name of the ARNS to check.
 * @param {PublishOptions} options The options for publishing the JavaScript file.
 */
const checkArnsExistence = async (name, options) => {
    const response = await fetch(
        `${DRE_URL}/contract/?id=${ARNS_REGISTRY}`
    );
    if (!response.ok) {
        throw new Error('Error fetching ARNS Registry state.');
    }
    const results = await response.json();

    if (results.state.records[name]) {
        throw new Error("ArNS name already exists");
    }

    console.log("Available to register:- ", name)

    return options;
};

/**
 * @param {string} name The name of the ARNS to register.
 * @param {NodeBundlr} bundlr The bundlr instance.
 * @param {string} tx The transaction id of the resource.
 */

const registerArns = async (name, bundlr, tx) => {
    const tags = getArnsTags(ARNS_REGISTRY, tx);
    const response = await bundlr.upload(name, { tags });
    // console.log(`response ==> ${JSON.stringify(response)}`);

    return `ArNs Registered ==> https://arweave.net/${response.id}`;
}