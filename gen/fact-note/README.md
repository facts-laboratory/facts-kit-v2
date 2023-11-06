# Renderer

A ReactJS component for "Community Notes" implemented using [Fact Markets](https://facts-protocol.arweave.dev/#/en/main).

## Install

`npm i https://arweave.net/YviFGLG5K8bTJF01nsbZbppOOfgu58ORkLqOR1wwuME`

## Use

You can pass the Fact Note component either a `txid` or a `transaction`.  If you pass it a `transaction` the component will use the transaction. Otherwise, it will fetch the transaction using the `txid`.

```jsx
import FactNote from '@facts-kit/fact-note';

...

return (
<FactNote tx={"tx goes id"} />

// OR

<FactNote transaction={"transaction object goes here"} />
)

...
```


## Dev

This project uses [Cosmos](https://reactcosmos.org/) and a custom web server to serve Fixtures like storybook. It lets you build components in isolation.  I used cosmos so I could continue to use `esbuild` rather than being forced by tyrants to use `vite` or `webpack` like they allgedly do with Storybook.

Start the app server:

```zsh
npm start
```

Start cosmos:

```zsh
npm run cosmos
```

Open the [App](http://localhost:5000)