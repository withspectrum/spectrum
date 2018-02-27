// @flow
const debug = require('debug')('iris:loaders:create-loader');
// $FlowIssue
import DataLoader from 'dataloader';
import unique from 'shared/unique-elements';
import type { Loader, DataLoaderOptions } from './types';

const CACHE_EXPIRY_TIME = 5000;

type CacheItem = {|
  data: mixed,
  // We need to store the time the item was last fetched from the db
  // and whether we can remove it via GC
  time: number,
  removeable?: boolean,
|};

type Cache = {
  [key: string]: CacheItem,
};

let caches: { [key: string]: Cache } = {};

// "GC" cleanup mechanism which evicts old records from the cache every 30s
// We block records that are needed by a db query that's currently in the air with the "removeable" key
const interval = setInterval(() => {
  debug('running gc');
  Object.keys(caches).forEach(cacheKey => {
    const cache = caches[cacheKey];
    Object.keys(cache).forEach(itemKey => {
      const item = cache[itemKey];
      if (
        item.removeable !== false &&
        item.time + CACHE_EXPIRY_TIME < Date.now()
      ) {
        debug(`found outdated item ${itemKey}, removing`);
        delete caches[cacheKey][itemKey];
      }
    });
  });
}, 10000);

type CreateLoaderOptionalOptions = {
  indexField?: Function | string,
  cacheKeyFn?: Function,
};

/**
 * Create a dataloader instance which caches results for 5s
 *
 * Usage:
 * user: createUserLoader = () => createLoader(users => getUsers(users), 'id');
 * loaders.user.load(id).then(user => ...)
 */
const createLoader = (
  batchFn: Function,
  { indexField, cacheKeyFn = key => key }: CreateLoaderOptionalOptions = {}
) => (options?: DataLoaderOptions): Loader => {
  // NOTE(@mxstbr): For some reason I have to set the default value like this here, no clue why. https://spectrum.chat/thread/552fc616-4da5-47a3-a118-4aaa58cb6561
  indexField = indexField || 'id';
  // TODO(@mxstbr): fn.toString is brittle and should probably be replaced with an actual unique key somehow down the line
  const cacheKey = batchFn.toString();
  if (!caches[cacheKey]) caches[cacheKey] = {};
  let cache = caches[cacheKey];

  return new DataLoader(keys => {
    debug(`fetch ${keys.length} items`);
    // If the item isn't in the cache or the cached version is older than 5s refetch it
    const uncachedKeys = keys.filter(key => {
      const stringKey = key.toString();
      if (!cache[stringKey]) return true;

      if (cache[stringKey].time + CACHE_EXPIRY_TIME < Date.now()) {
        delete cache[stringKey];
        return true;
      }
      debug(`block item ${stringKey} from being removed`);
      // The record might expire between now and the time the db query returns
      // We don't want our "GC" cleanup mechanism to remove the data in that
      // period of time, so we block ther record from being deleted
      cache[stringKey].removeable = false;
      return false;
    });

    debug(`cached items: ${keys.length - uncachedKeys.length}`);
    if (uncachedKeys.length === 0) {
      debug('all items in cache, bailing out early');
      keys.forEach(key => {
        debug(`unblock item ${key.toString()} from being removed`);
        delete cache[key.toString()].removeable;
      });
      return Promise.resolve(keys.map(key => cache[key.toString()].data));
    }

    const uniqueUncached = unique(uncachedKeys);

    debug(`fetching ${uniqueUncached.length} unique uncached items`);
    return batchFn(uniqueUncached).then(results => {
      const cachedResults = keys
        .filter(key => !!cache[key.toString()])
        .map(key => {
          debug(`unblock item ${key.toString()} from being removed`);
          delete cache[key.toString()].removeable;
          return cache[key.toString()].data;
        });
      debug(
        `got results, merging ${results.length} new items with ${
          cachedResults.length
        } cached items`
      );
      const fullResults = [...results, ...cachedResults].filter(Boolean);
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
