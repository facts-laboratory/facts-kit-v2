# PackaJS

A javascript implementation of the [Permanent Package](https://specs.arweave.dev/?tx=kpBbb2yW-dtyVcd3TDgCfNWWZMBfgbSTfVLsydlVpdo) protocol.

![PackaJS](https://g8way.io/jkPpggGUW-ofqKKYzG4Al8luFwNURoqXkpLFjqmiS58)

## Install

(use -g if you want to install globally but I recommend installing as a development dependency)

Install from `tx`:

`npm i -D https://g8way.io/kWXhgcqXu_DKL5kpQ7TlM3qM6YUx9Acoc-fnFFRWJC4`

Install from **ARNS**:

`npm i -D https://packajs.g8way.io`

## Usage

The file needs to be a javascript package that has been zipped up in a `.tgz` file (like `npm pack`).

You may need to run `(cd dist && npm pack)` before executing this script.  

${PATH_TO_WALLET} references an environment variable that points to an arweave keyfile.  You can replace it with `/path/to/wallet.js` if you want to skip the environment variable part.

_npm script_

`packajs pubjs -t Type=perma-package -t Title=PackaJS -t Description=\"Publish js packages to the permaweb. Forever.\" -t Read-Me=https://github.com/facts-laboratory/facts-kit-v2/blob/main/packages/packajs/README.md -t Repository=https://github.com/facts-laboratory/facts-kit-v2/tree/main/packages/packajs -w ${PATH_TO_WALLET}`

## Help

`packajs pubjs --help`
