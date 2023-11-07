# PackaJS

A javascript implementation of the [Permanent Package](https://specs.arweave.dev/?tx=kpBbb2yW-dtyVcd3TDgCfNWWZMBfgbSTfVLsydlVpdo) protocol.

![PackaJS](https://g8way.io/jkPpggGUW-ofqKKYzG4Al8luFwNURoqXkpLFjqmiS58)

## What's published?

A `PATH_MANIFEST` that points to all of your package versions.  It also has a path for `readme`, `latest`, and `manifest`.  An application is cloned and added to this manifest as well, which is a small app that views the package `readme` and shows the latest version in a dropdown of all of the versions.  Each version can be downloaded by clicking the item in the drop down.

Structure:

- `https://arweave.net/<manifest_tx>/manifest`: A JSON copy of the manifest.
- `https://arweave.net/<manifest_tx>/latest`: The latest version of the package. (`npm i https://arweave.net/<manifest_tx>/latest`)
- `https://arweave.net/<manifest_tx>/0.0.1`: Version `0.0.1`
- `https://arweave.net/<manifest_tx>/readme`: A markdown readme file. (defaults to a packajs readme)
- `https://arweave.net/<manifest_tx>/`: Points to the `index.html` file of an app. (This will be customizable soon.)

With ARNS:

- `https://<your-arns>.arweave.dev/<manifest_tx>/manifest`: A JSON copy of the manifest.
- `https://<your-arns>.arweave.dev/<manifest_tx>/latest`: The latest version of the package. (`npm i https://<your-arns>.arweave.dev/<manifest_tx>/latest`)
- `https://<your-arns>.arweave.dev/<manifest_tx>/0.0.1`: Version `0.0.1`
- `https://<your-arns>.arweave.dev/<manifest_tx>/readme`: A markdown readme file. (defaults to a packajs readme)
- `https://<your-arns>.arweave.dev/<manifest_tx>/`: Points to the `index.html` file of an app. (This will be customizable soon.)

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

1. Own an ARNS name (https://permapages.arweave.dev: use the same wallet you use with packajs)
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

Here's how you tell `packajs` to update arns:

`packajs pubjs --arns -w <path-to-wallet>`

## Web App

Go to your manifest `tx` to view the web app.
## Help

`packajs pubjs --help`

## Generating

`packajs` has a generate command that allows you to generate:

1. A react app `packajs generate web`
2. A react renderer/package (component that can be installed on your app `npm i <package>`) `packajs generate renderer`.
