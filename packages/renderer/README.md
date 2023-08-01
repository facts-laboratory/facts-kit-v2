# Renderer

A ReactJS utiltity component for Renderers.


## Example App

There's a working example here:

- https://github.com/jshaw-ar/renderer-shell-example

## Install

`npm i https://arweave.net/YviFGLG5K8bTJF01nsbZbppOOfgu58ORkLqOR1wwuME`

## Use

```jsx
import Shell from '@facts-kit/renderer';
import './App.css';

const PBJ = ({ data }) => {
  const {peanutbutter, jelly, bread} = data;
  return (
    <>
      <p>Peanut Butter: {peanutbutter}</p>
      <p>Jelly: {jelly}</p>
      <p>Bread: {bread}</p>
    </>
  );
};
function App() {
  return (
    <div className="App">
      Blah
      <Shell
        tx="xTqt_wZlmkw3iz5t_05Ll1bTXs1BSpK6MFghXo-Fdao" // optional but you need it if you dont pass data
        child={<PBJ />}
        errorComponent={<SomeErrorComponent />} // optional
        loadingComponent={<SomeLoadingComponent />} // optional
        data={{...}} // optional
      />
    </div>
  );
}

export default App;

```

## Data Protocol Spec

- https://specs.arweave.dev/?tx=F63wJCavB_sN2xxW-qtQ1Vv7_eRgmYCdcoQPMp_-N0w

This spec can be used to define `DataProtocols` that can be used to build renderers for.

If I create a data protocol for a pb and j, it might need 3 things:

- peanutbutter
- jelly
- bread

You can create a PBJ data protocol for anyone to deploy pbj transactions to the web where the trasaction data might look like this: 

```json
{
  "peanutbutter": "chunky",
  "bread": "wheat",
  "jelly": "strawberry"
}
```

Then you can fetch any PBJ transaction id from arweave with tag: `{ "name": "Data-Protocol", "value": "pbj"}` grab those tx ids, and pass them to the Shell with a component built for that data protocol.


