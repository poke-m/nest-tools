import { expect, test } from '@jest/globals';

import { Store } from '../src';

test('Store', async () => {
  type Obj = { name: string };

  interface Instance {
    obj1: Obj;
    obj2: Obj;
  }

  const libStore = Store.createStore<Instance>();

  libStore.set('obj1', { name: '1' });
  libStore.set('obj2', { name: '2' });

  expect(libStore.get('obj1').name === '1').toBe(true);
  expect(libStore.get('obj2').name === '2').toBe(true);
});
