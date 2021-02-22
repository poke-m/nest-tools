/**
 * Global store
 */
export const createStore = <Keys>() => {
  /**
   * Access the instance object using the map structure
   */
  const store: Map<Keys, any> = new Map();

  /**
   * Access in store
   */
  return {
    get: <T = any>(key: Keys): T => {
      return store.get(key);
    },

    set: <T = any>(key: Keys, value: T): void => {
      store.set(key, value);
    },
  };
};
