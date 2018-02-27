// @flow
const debug = require('debug')('iris:loaders:create-loader');
// $FlowIssue
import DataLoader from 'dataloader';
import unique from 'shared/unique-elements';
import type { Loader, DataLoaderOptions } from './types';

type CacheItem = {|
  data: mixed,
  // We need to store the time the item was last fetched from the db
  // and whether we can remove it via GC
  time: number,
|};

type Cache = {
  __meta: {
    expiryTime: number,
  },
  [key: string]: CacheItem,
};

let caches: Map<Function, Cache> = new Map();

// "GC" cleanup mechanism which evicts old records from the cache every 30s
const interval = setInterval(() => {
  debug('running gc');
  caches.forEach(cache => {
    Object.keys(cache).forEach(itemKey => {
      if (itemKey === '__meta') return;
      const item = cache[itemKey];
      if (item.time + cache.__meta.expiryTime < Date.now()) {
        debug(`found outdated item ${itemKey}, removing`);
        delete cache[itemKey];
      }
    });
  });
}, 10000);

type CreateLoaderOptionalOptions = {|
  getKeyFromResult?: Function | string,
  cacheExpiryTime?: number,
|};

/**
 * Create a dataloader instance which also caches results across requests. The default caching duration is 5s.
 *
 * Usage:
 * user: createUserLoader = () => createLoader(users => getUsers(users), 'id');
 * loaders.user.load(id).then(user => ...)
 */
const createLoader = (
  batchFn: Function,
  { getKeyFromResult, cacheExpiryTime }: CreateLoaderOptionalOptions = {}
) => (options?: DataLoaderOptions): Loader => {
  // NOTE(@mxstbr): For some reason I have to set the default value like this here, no clue why. https://spectrum.chat/thread/552fc616-4da5-47a3-a118-4aaa58cb6561
  getKeyFromResult = getKeyFromResult || 'id';
  cacheExpiryTime = cacheExpiryTime || 5000;
  // Either create the cache or get the existing one
  const newCache = {
    __meta: {
      expiryTime: cacheExpiryTime,
    },
  };
  // NOTE(@mxstbr): That || newCache part will never be hit
  // but for some reason  Flow complains otherwise
  let cache: Cache =
    caches.get(batchFn) ||
    caches.set(batchFn, newCache).get(batchFn) ||
    newCache;

  return new DataLoader(keys => {
    debug(`fetch ${keys.length} items`);
    let uncachedKeys = [];
    let cachedResults = [];
    keys.forEach(key => {
      const stringKey = key.toString();
      const item = cache[stringKey];

      // If we don't have a result in the cache or the result is stale fetch the data again
      if (!item) return uncachedKeys.push(key);
      if (item.time + cacheExpiryTime < Date.now()) {
        delete cache[stringKey];
        return uncachedKeys.push(key);
      }

      // We need to store the cached results out here since they might expire
      // until the database query finishes, which would break everything
      cachedResults.push(item.data);
    });

    debug(`cached items: ${keys.length - uncachedKeys.length}`);
    if (uncachedKeys.length === 0) {
      debug('all items in cache, bailing out early');
      return Promise.resolve(cachedResults);
    }

    const uniqueUncached = unique(uncachedKeys);

    debug(`unique uncached items: ${uniqueUncached.length}`);
    return batchFn(uniqueUncached).then(results => {
      debug(
        `got data, merging ${results.length} new items with ${
          cachedResults.length
        } cached items`
      );
      const fullResults = [...results, ...cachedResults].filter(Boolean);
      const normalized = normalizeRethinkDbResults(keys, getKeyFromResult)(
        fullResults
      );
      normalized.forEach((result, index) => {
        const key = keys[index].toString();
        if (cachedResults.indexOf(result) > -1 || cache[key]) return;
        debug(`cache result for ${key}`);
        cache[key] = {
          data: result,
          time: Date.now(),
        };
      });
      return normalized;
    });
  }, options);
};

/**
 * Map RethinkDB results back to the original keys that were passed. This is necessary because Rethink doesn't return data in order, deduplicates and does a bunch of other stuff, so we have to bring the data back into the shape DataLoader expects it to be in
 *
 * requested : ['id1', 'id2', 'id1', 'id3']
 * received  : [{ id: 'id1' }, { id: 'id3' }, { id: 'id2' }]
 * normalized: [{ id: 'id1' }, { id: 'id2' }, { id: 'id1' }, { id: 'id3' }];
 *
 * You can pass a custom getKeyFromResult if the index you're going for isn't the "id" field. For example:
 *
 * requested : ['id1', 'id1']
 * received  : [{ group: 'id1', reduction: {...} }]
 * normalized with getKeyFromResult = "group": [{ group: 'id1', reduction: {...} }, { group: 'id1', reduction: {...} }]
 *
 * Inspired by the DataLoader docs https://github.com/facebook/dataloader/blob/master/examples/RethinkDB.md
 */
function normalizeRethinkDbResults(keys, getKeyFromResult) {
  return results => {
    var indexedResults = new Map();
    results.forEach(res => {
      const key =
        typeof getKeyFromResult === 'function'
          ? getKeyFromResult(res)
          : res[getKeyFromResult];
      indexedResults.set(key.toString(), res);
    });
    return keys.map(val => indexedResults.get(val.toString()) || null);
  };
}

export default createLoader;
