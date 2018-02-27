// @flow
const debug = require('debug')('iris:loaders:create-loader');
import DataLoader from 'dataloader';
import unique from 'shared/unique-elements';
import type { Loader, DataLoaderOptions } from './types';

type Cache = {
  [key: string]: {
    data: mixed,
    time: number,
  },
};

let caches = {};

/**
 * Create a caching dataloader instance which caches results for 5s
 *
 * Usage:
 * createUserLoader = () => createLoader(users => getUsers(users), 'id');
 */
const createLoader = (
  batchFn: Function,
  indexField: string | Function = 'id',
  cacheKeyFn: Function = key => key
) => (options?: DataLoaderOptions): Loader => {
  // TODO(@mxstbr): This is very brittle (fn.toString()) and should probably be replaced with something more solid down the line
  const cacheKey = batchFn.toString();
  if (!caches[cacheKey]) caches[cacheKey] = {};
  let cache = caches[cacheKey];

  return new DataLoader(keys => {
    debug(`fetch ${keys.length} items`);
    // If the item isn't in the cache or the cached version is older than 5s refetch it
    const uncachedKeys = keys.filter(key => {
      const stringKey = key.toString();
      if (!cache[stringKey]) return true;

      if (cache[stringKey].time + 5000 < Date.now()) {
        delete cache[stringKey];
        return true;
      }
      return false;
    });
    debug(`cached items: ${keys.length - uncachedKeys.length}`);
    if (uncachedKeys.length === 0) {
      debug('all items in cache, bailing out early');
      return Promise.resolve(keys.map(key => cache[key.toString()].data));
    }

    const uniqueUncached = unique(uncachedKeys);

    debug(`fetching ${uniqueUncached.length} unique uncached items`);

    return batchFn(uniqueUncached).then(results => {
      const cachedResults = keys
        .filter(key => !!cache[key.toString()])
        .map(key => cache[key.toString()].data);
      debug(
        `got results, merging ${results.length} new items with ${
          cachedResults.length
        } cached items`
      );
      const fullResults = [...results, ...cachedResults];
      const normalized = normalizeRethinkDbResults(
        keys,
        indexField,
        cacheKeyFn
      )(fullResults);
      normalized.forEach((result, index) => {
        debug(`cache result for ${keys[index].toString()}`);
        cache[keys[index].toString()] = {
          data: result,
          time: Date.now(),
        };
      });
      return normalized;
    });
  }, options);
};

// These helper functions were taken from the DataLoader docs
// https://github.com/facebook/dataloader/blob/master/examples/RethinkDB.md
function indexResults(results, indexField, cacheKeyFn) {
  var indexedResults = new Map();
  results.forEach(res => {
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
