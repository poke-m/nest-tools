/**
 * Global store
 */
export const createStore = <Instance>() => {
  /**
   * Access the instance object using the map structure
   */
  const store: Map<keyof Instance, Instance[keyof Instance]> = new Map();

  /**
   * Access in store
   */
  return {
    get: (key: keyof Instance): Instance[keyof Instance] => {
      return store.get(key);
    },

    set: (key: keyof Instance, value: Instance[keyof Instance]): void => {
      store.set(key, value);
    },
  };
};
