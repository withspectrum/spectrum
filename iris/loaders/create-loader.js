// @flow
const debug = require('debug')('iris:loaders:create-loader');
// $FlowIssue
import DataLoader from 'dataloader';
// Least-recently-used cache that evicts items based on when they were last used
import LRU from 'lru-cache';
import unique from 'shared/unique-elements';
import { getLengthInBytes } from 'shared/string-byte-length';
import type { Loader, DataLoaderOptions, Key } from './types';

type CreateLoaderOptionalOptions = {|
  getKeyFromResult?: Function | string,
  cacheExpiryTime?: number,
|};

const TWO_HUNDRED_AND_FIFTY_MEGABYTE = 2.5e8;

let caches: Map<Function, LRU<string, mixed>> = new Map();

// Proactively evict old data every 30s instead of only when .get is called
const interval = setInterval(() => {
  caches.forEach(cache => cache.prune());
}, 30000);

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
  const newCache = new LRU({
    max: TWO_HUNDRED_AND_FIFTY_MEGABYTE,
    maxAge: cacheExpiryTime,
    length: item => {
      try {
        return getLengthInBytes(JSON.stringify(item));
      } catch (err) {
        return 1;
      }
    },
  });

  // NOTE(@mxstbr): That || newCache part will never be hit
  // but for some reason Flow complains otherwise
  let cache =
    caches.get(batchFn) ||
    caches.set(batchFn, newCache).get(batchFn) ||
    newCache;

  return new DataLoader((keys: Array<Key>) => {
    let uncachedKeys = [];
    let cachedResults = [];
    keys.forEach(key => {
      const stringKey = key.toString();
      const item = cache.get(stringKey);

      // If we don't have a result in the cache fetch the data again
      if (!item) return uncachedKeys.push(key);

      // We need to store the cached results out here since they might expire
      // until the database query finishes, which would break everything
      cachedResults.push(item);
    });

    if (uncachedKeys.length === 0) {
      debug(`cache hit rate: 100% (bailing early)`);
      return Promise.resolve(cachedResults);
    }

    const uniqueUncached = unique(uncachedKeys);

    return batchFn(uniqueUncached).then(results => {
      debug(`cache hit rate: ${cachedResults.length / keys.length * 100}%`);
      const fullResults = [...results, ...cachedResults].filter(Boolean);
      const normalized = normalizeRethinkDbResults(keys, getKeyFromResult)(
        fullResults
      );
      normalized.forEach((result, index) => {
        const key = keys[index].toString();
        if (cachedResults.indexOf(result) > -1 || cache[key]) return;
        cache.set(key, result);
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
