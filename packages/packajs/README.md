# PackaJS

A javascript implementation of the [Permanent Package](https://specs.arweave.dev/?tx=kpBbb2yW-dtyVcd3TDgCfNWWZMBfgbSTfVLsydlVpdo) protocol.

![PackaJS](https://g8way.io/jkPpggGUW-ofqKKYzG4Al8luFwNURoqXkpLFjqmiS58)

## Install

(use -g if you want to install globally but I recommend installing as a development dependency)

`npm i -D https://packajs.g8way.io/latest`

If you'd like to install a specific version:

`npm i -D https://packajs.g8way.io/<version>`

## Initialize Config

- `.packajs/config.json`
- `.packajs/manifest.json`

To setup your config files, run:

`packajs init`

More info on config coming soon.

## Usage

The file needs to be a javascript package that has been zipped up in a `.tgz` file (use `npm pack`).

You may need to run `(cd dist && npm pack)` before executing this script.  


_npm scripts_

### ANS-110

`packajs pubjs -t Type=perma-package -t Title=PackaJS -t Description=\"Publish js packages to the permaweb. Forever.\" -t Read-Me=https://github.com/facts-laboratory/facts-kit-v2/blob/main/packages/packajs/README.md -t Repository=https://github.com/facts-laboratory/facts-kit-v2/tree/main/packages/packajs -w </path/to/wallet.json>`

## Target File

`packajs pubjs -w </path/to/wallet.json> -f </path/to/file.tgz>`

## ARNS

If you'd like to deploy your packages with an ARNS name, you need to do 2 things:

1. Own an ARNS name (https://permapages.arweave.dev)
2. Add your `ANT` tx (smartweave contractId) to `.packajs/config.json`.

Here's how `packajs` is configured:

```json
{
  ...,
  "ant": {
    "tx": "cTqVzAom6wGYXN9_S3LnkNGPIu7i-c7t1YPEla8Tzb8",
    "name": "packajs"
  },
  ...
}
```

## Web App

Coming soon...  See https://packajs.arweave.dev for the ALPHA.

## Help

`packajs pubjs --help`
