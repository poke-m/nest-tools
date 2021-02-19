import { expect, test } from '@jest/globals';

import { Store } from '../src';

test('Store', async () => {
  type Keys = 'obj1' | 'obj2';
  type Obj = { name: string };

  const libStore = Store.createStore<Keys>();

  libStore.set('obj1', { name: '1' });
  libStore.set('obj2', { name: '2' });

  expect(libStore.get<Obj>('obj1').name === '1').toBe(true);
  expect(libStore.get<Obj>('obj2').name === '2').toBe(true);
});
