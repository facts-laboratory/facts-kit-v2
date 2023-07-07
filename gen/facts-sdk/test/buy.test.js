import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const test = suite('buy');

test('buy', () => {
  assert.is('buy', 'buy');
});

test.run();
