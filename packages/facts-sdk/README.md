# Facts SDK JS

<img src="https://oqfrmvvkx6kfvhswy45wpmpppwjwd6seafaaehb2tmb47i2bgpgq.arweave.net/dAsWVqq_lFqeVsc7Z7HvfZNh-kQBQAIcOpsDz6NBM80"  width="100">

The javascript implementation of the Facts Protocol.

## Install

`npm i @facts-kit/facts-sdk-v2@latest warp-contracts@1.4.14 warp-contracts-plugin-deploy@1.0.9 warp-contracts-plugin-signature@1.0.14`

## Import Dependencies

```js
import { WarpFactory } from 'warp-contracts';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { getPrice, getBalance, getSupply, buy, sell, attach, deploy } from '@facts-kit/facts-sdk-v2';
```

## Get Price

Pass warp as a dependency.

```js
const warp = WarpFactory.forMainnet();
const output = await getPrice(warp)({
  qty: 1,
  tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
  position: 'oppose',
});
```

Returns

```json
{
  "dre": "string",
  "result": {
    "qty": "number",
    "price": "number",
    "fee": "number",
    "owner": {
      "addr": "string",
      "position": "string"
    },
    "position": "string",
    "factMarket": "string"
  }
}
```
## Get Supply

Pass warp as a dependency.

```js
const warp = WarpFactory.forMainnet();
const output = await getSupply(warp)({
  tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
});
```

Returns

```json
{
  "dre": "string",
  "result": {
    "total": "number",
    "supprt": "number",
    "oppose": "number"
  }
}
```

## Get Balance

Pass warp as a dependency.

```js
const warp = WarpFactory.forMainnet();
const target = '9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4';
const output = await getBalance(warp)({
  tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
  target,
});
```

Returns

```json
{
  "dre": "string",
  "result": {
    "target": "string",
    "ticker": "string",
    "balance": "number",
    "balances": {
      "support": "number",
      "oppose": "number"
    }
  }
}
```

## Buy

Pass `warp`, and `signer` as dependencies.

```js
const tx = await buy({ warp, signer: new InjectedArweaveSigner(window.arweaveWallet) })({
  qty: 1,
  tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
  position: 'support',
});
```

Returns

```json
{
  "dre": "string",
  "result": {
    "qty": "number",
    "price": "number",
    "fee": "number",
    "owner": {
      "addr": "string",
      "position": "string"
    },
    "position": "string",
    "factMarket": "string"
  },
  "tx": "string" // the tx of the new fact market interaction
}
```

## Sell

Pass `warp`, and `signer` as dependencies.

```js
const tx = await sell({warp, signer: new InjectedArweaveSigner(window.arweaveWallet) })({
  qty: 1,
  tx: 'OwDhifPxKBKK1ArPMtjRrg4DjW3XcOpw0q3gBLWu3dY',
  position: 'support',
});
```

Returns: `string` (tx id of the new fact market interaction)

## Deploy

Pass `warp`, `signer`, `env`, and `deployPlugin` as dependencies.

```js
const output = await deploy({
  warp,
  signer: new InjectedArweaveSigner(window.arweaveWallet),
  deployPlugin: new DeployPlugin(),
})({
  tags: {
    type: 'test',
    title: 'Test Fact Market',
    description: 'Testing Fact Markets',
    renderWith: 'renderer',
    topics: [],
  },
  extraTags: [{ name: 'Some', value: 'Tag' }],
  rebutTx: 'test',
  data: 'test fact market data',
  position: 'support',
});
```

Returns: `tx` (the fact market contract id)

## Attach

Pass `warp`, `signer`, `env`, and `deployPlugin` as dependencies.

```js
const output = await attach({
  warp,
  signer: new ArweaveSigner(jwk),
  deployPlugin: new DeployPlugin(),
  env: 'browser',
})({
  tags: {
    type: 'test',
    title: 'Test Fact Market',
    description: 'Testing Fact Markets',
    renderWith: 'renderer',
    topics: [],
  },
  extraTags: [{ name: 'Some', value: 'Tag' }],
  rebutTx: 'test',
  data: 'test fact market data',
  position: 'support',
  attachToTx: 'RZlH3NT_rTu9CLXGGhGDjnfxbCOOWfCNcGK3-tEjE0U',
});
```

Returns: `tx` (the fact market contract id)
