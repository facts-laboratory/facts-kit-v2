import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { main } from '../main.js';
const test = suite('main');

test('main', () => {
  assert.is('main', 'main');
});

test.run();
