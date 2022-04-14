// @flow
import DataLoader from 'dataloader';
import unique from 'shared/unique-elements';
import type { Loader, DataLoaderOptions } from './types';

/**
 * Create a dataloader instance for a request and type
 *
 * Usage:
 * createUserLoader = () => createLoader(users => getUsers(users), 'id');
 */
const createLoader = (
  batchFn: Function,
  indexField: string | Function = 'id',
  cacheKeyFn: Function = key => key
) => (options?: DataLoaderOptions): Loader => {
  return new DataLoader(keys => {
    return batchFn(unique(keys)).then(
      normalizeRethinkDbResults(keys, indexField, cacheKeyFn)
    );
  }, options);
};

// These helper functions were taken from the DataLoader docs
// https://github.com/facebook/dataloader/blob/master/examples/RethinkDB.md
function indexResults(results, indexField, cacheKeyFn) {
  var indexedResults = new Map();
  results.filter(Boolean).forEach(res => {
    const key =
      typeof indexField === 'function' ? indexField(res) : res[indexField];
    indexedResults.set(cacheKeyFn(key), res);
  });
  return indexedResults;
}

function normalizeRethinkDbResults(keys, indexField, cacheKeyFn) {
  return results => {
    var indexedResults = indexResults(results, indexField, cacheKeyFn);
    return keys.map(val => indexedResults.get(cacheKeyFn(val)) || null);
  };
}

export default createLoader;
