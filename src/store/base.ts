/**
 * Global store
 */
export const createStore = <KEY>() => {
  /**
   * Access the instance object using the map structure
   */
  const store: Map<KEY, any> = new Map();

  /**
   * Access in store
   */
  return {
    get: <T>(key: KEY): T => {
      return store.get(key);
    },

    set: <T>(key: KEY, value: T): void => {
      store.set(key, value);
    },
  };
};
