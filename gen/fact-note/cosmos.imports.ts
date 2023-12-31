// This file is automatically generated by Cosmos. Add it to .gitignore and
// only edit if you know what you're doing.

import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';

import * as fixture0 from './src/App.fixture.jsx';

export const rendererConfig: RendererConfig = {
  "playgroundUrl": "http://localhost:5000",
  "rendererUrl": "http://localhost:3000"
};

const fixtures = {
  'src/App.fixture.jsx': { module: fixture0 }
};

const decorators = {};

export const moduleWrappers: UserModuleWrappers = {
  lazy: false,
  fixtures,
  decorators
};
