// @flow
import DataLoader from 'dataloader';
import type { Loader } from './types';

/**
 * Create a dataloader instance for a request and type
 *
 * Usage:
 * createUserLoader = () => createLoader(users => getUsers(users), 'id');
 */
const createLoader = (
  batchFn: Function,
  indexField: string = 'id',
  cacheKeyFn: Function = key => key
): Loader => {
  return new DataLoader(keys => {
    return batchFn(keys).then(
      normalizeRethinkDbResults(keys, indexField, cacheKeyFn)
    );
  });
};

// These helper functions were taken from the DataLoader docs
// https://github.com/facebook/dataloader/blob/master/examples/RethinkDB.md
function indexResults(results, indexField, cacheKeyFn) {
  var indexedResults = new Map();
  results.forEach(res => {
    indexedResults.set(cacheKeyFn(res[indexField]), res);
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
