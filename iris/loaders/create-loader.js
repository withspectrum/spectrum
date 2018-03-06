// @flow
const debug = require('debug')('iris:loaders:create-loader');
import DataLoader from 'dataloader';
import LRU from 'lru-cache';
import unique from 'shared/unique-elements';
import { getLengthInBytes } from 'shared/string-byte-length';
import type { Loader, DataLoaderOptions, Key } from './types';

type CreateLoaderOptionalOptions = {|
  getCacheKeyFromResult?: Function | string,
  getCacheKeyFromInput?: Function,
  cacheExpiryTime?: number,
|};

const ONE_GIGABYTE = 1e9;
const SEVEN_HUNDRED_AND_FIFTY_MEGABYTE = 7.5e8;

// We allow all caches together to maximally use 1gig of memory
// and each individual cache can maximally use 750mb of memory
let caches: LRU<Function, LRU<string, mixed>> = new LRU({
  max: ONE_GIGABYTE,
  length: item => (item && item.length) || 1,
});

// Proactively evict old data every 29s instead of only when .get is called
const interval = setInterval(() => {
  caches.prune();
  caches.forEach(cache => cache.prune());
}, 29000);

/**
 * Create a dataloader instance which also caches results across requests. The default caching duration is one minute.
 *
 * Usage:
 * user: createUserLoader = () => createLoader(users => getUsers(users), 'id');
 * loaders.user.load(id).then(user => ...)
 */
const createLoader = (
  batchFn: Function,
  {
    getCacheKeyFromResult,
    getCacheKeyFromInput,
    cacheExpiryTime,
  }: CreateLoaderOptionalOptions = {}
) => (options?: DataLoaderOptions): Loader => {
  // NOTE(@mxstbr): For some reason I have to set the default value like this here, no clue why. https://spectrum.chat/thread/552fc616-4da5-47a3-a118-4aaa58cb6561
  getCacheKeyFromResult = getCacheKeyFromResult || 'id';
  getCacheKeyFromInput =
    getCacheKeyFromInput || ((input: Key) => input.toString());
  cacheExpiryTime = cacheExpiryTime || 60000;
  // Either create the cache or get the existing one
  const newCache = new LRU({
    max: SEVEN_HUNDRED_AND_FIFTY_MEGABYTE,
    maxAge: cacheExpiryTime,
    length: item => {
      try {
        return getLengthInBytes(JSON.stringify(item));
      } catch (err) {
        return 1;
      }
    },
  });

  let cache = caches.get(batchFn);
  if (!cache) {
    caches.set(batchFn, newCache);
    cache = caches.get(batchFn);
  }

  return new DataLoader((keys: Array<Key>) => {
    let uncachedKeys = [];
    let cachedResults = [];
    keys.forEach(key => {
      // $FlowIssue for some reason Flow thinks getCacheKeyFromInput can be undefined here but not above the return new DataLoader _shrugs_
      const stringKey = getCacheKeyFromInput(key);
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
      const normalized = normalizeRethinkDbResults(
        keys,
        getCacheKeyFromResult,
        getCacheKeyFromInput
      )(fullResults);
      normalized.forEach((result, index) => {
        // $FlowIssue for some reason Flow thinks getCacheKeyFromInput can be undefined here but not above the return new DataLoader _shrugs_
        const key = getCacheKeyFromInput(keys[index]);
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
 * You can pass a custom getCacheKeyFromResult if the index you're going for isn't the "id" field. For example:
 *
 * requested : ['id1', 'id1']
 * received  : [{ group: 'id1', reduction: {...} }]
 * normalized with getCacheKeyFromResult = "group": [{ group: 'id1', reduction: {...} }, { group: 'id1', reduction: {...} }]
 *
 * Inspired by the DataLoader docs https://github.com/facebook/dataloader/blob/master/examples/RethinkDB.md
 */
function normalizeRethinkDbResults(
  keys,
  getCacheKeyFromResult,
  getCacheKeyFromInput
) {
  return results => {
    var indexedResults = new Map();
    results.forEach(res => {
      const key =
        typeof getCacheKeyFromResult === 'function'
          ? getCacheKeyFromResult(res)
          : res[getCacheKeyFromResult];
      indexedResults.set(key, res);
    });
    return keys.map(
      // $FlowIssue for some reason Flow thinks getCacheKeyFromInput can be undefined here but not above the return new DataLoader _shrugs_
      val => indexedResults.get(getCacheKeyFromInput(val)) || null
    );
  };
}

export default createLoader;
