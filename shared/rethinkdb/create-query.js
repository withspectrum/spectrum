/* @flow
 *
 * createQuery
 * Create a RethinkDB query and cache it's result in a TagCache
 *
 * Usage:
 *
 * const getThreadById = createQuery({
 *   // NOTE: No .run at the end of the query!!!
 *   read: (threadId: string) => db.table('threads').get(threadId),
 *   tags: (threadId: string) => (thread: ?DBThread) => thread ? [thread.id, thread.communityId, thread.channelId] : [],
 * });
 */

const debug = require('debug')('shared:rethinkdb:db-query-cache');
import TagCache from 'redis-tag-cache';

const queryCache = new TagCache({
  defaultTimeout: 86400,
  redis: {
    keyPrefix: 'query-cache',
    port: process.env.REDIS_CACHE_PORT,
    host: process.env.REDIS_CACHE_URL,
    password: process.env.REDIS_CACHE_PASSWORD,
  },
});

type Query<O> = {
  toString: Function,
  run: () => Promise<?O>,
};

type GetQuery<I, O> = (...args: I) => Promise<Query<O>> | Query<O>;

type ProcessFn<I, O> = (...args: I) => (data: ?O) => *;

type CreateQueryInput<I, O> =
  | {|
      read: GetQuery<I, O>,
      process?: ProcessFn<I, O> | Promise<ProcessFn<I, O>>,
      tags: (...args: I) => (data: *) => Array<?string>,
    |}
  | {|
      write: GetQuery<I, O>,
      process?: ProcessFn<I, O> | Promise<ProcessFn<I, O>>,
      invalidateTags: (...args: I) => (data: *) => Array<?string>,
    |};

let TOTAL_QUERIES = 0;
let CACHED_RESULTS = 0;

if (debug.enabled) {
  debug('Logging of cache hit rate enabled! (every 30s)');
  setInterval(() => {
    debug(
      `Cache hit rate over the last 30s: ${(CACHED_RESULTS / TOTAL_QUERIES) *
        100}% (${CACHED_RESULTS} of ${TOTAL_QUERIES})`
    );
  }, 30000);
}

export const createQuery = <I: Array<any>, O: any>(
  input: CreateQueryInput<I, O>
) => {
  const getQuery = input.read ? input.read : input.write;
  const getTags = input.tags ? input.tags : input.invalidateTags;

  return async (...args: I) => {
    TOTAL_QUERIES++;
    // If we have a cached response return that asap...
    const query = await getQuery(...args);
    const queryString = query.toString();
    const cached = await queryCache.get(queryString);
    if (cached) {
      CACHED_RESULTS++;
      return cached;
    }

    if (typeof query.run !== 'function')
      throw new Error(
        'Do not call .run() on the query passed to createQuery! Pass the query without .run()'
      );

    // ...otherwise run the query and calculate the tags
    const result = await query
      .run()
      .then(
        async res =>
          input.process
            ? await Promise.resolve(input.process).then(p => p(...args)(res))
            : res
      );
    const tags = getTags(...args)(result).filter(Boolean);
    // Then either invalidate the tags or store the result in the cache tagged with the calculated tags
    if (input.invalidateTags) {
      await queryCache.invalidate(...tags);
    } else {
      await queryCache.set(queryString, result, tags);
    }
    return result;
  };
};
