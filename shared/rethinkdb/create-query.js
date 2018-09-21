/* @flow
 *
 * Create a RethinkDB query and cache it's result in a TagCache
 *
 * Usage:
 *
 * const getThreadById = createReadQuery({
 *   // NOTE: No .run() at the end of the query!!!
 *   query: (threadId: string) => db.table('threads').get(threadId),
 *   tags: (threadId: string) => (thread: ?DBThread) => thread ? [thread.id, thread.communityId, thread.channelId] : [],
 * });
 *
 * const updateUser = createWriteQuery({
 *  // NOTE: .run() at the end of the query
 *  query: (userId: string, data: Object) => db.table('users').get(userId).update(data).run(),
 *  invalidateTags: (userId: string) => () => [userId]
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

type RethinkDBQuery<O> = {
  toString: Function,
  run: () => Promise<O>,
};

type ProcessFn<I, O> = (...args: I) => (data: O) => Promise<*> | *;

type TagsFn<I, O> = (...args: I) => (data: O) => Array<?string>;

type CreateReadQueryInput<I, O> = $Exact<{
  query: (...args: I) => Promise<RethinkDBQuery<O>> | RethinkDBQuery<O>,
  process?: ProcessFn<I, O>,
  tags: TagsFn<I, O>,
}>;

export const createReadQuery = <I: Array<any>, O: any>(
  input: CreateReadQueryInput<I, O>
) => {
  return async (...args: I) => {
    TOTAL_QUERIES++;
    const query = await input.query(...args);
    const queryString = query.toString();
    const cached = await queryCache.get(queryString);
    if (cached) {
      CACHED_RESULTS++;
      return cached;
    }

    if (typeof query.run !== 'function') {
      throw new Error(
        `Do not call .run() on the query passed to createReadQuery!

Bad: db.table('users').get(userId).run()
Good: db.table('users').get(userId)

If you need to post-process the query data (.run().then()), use the \`process\` hook.
`
      );
    }

    const result = await query
      .run()
      .then(input.process ? input.process(...args) : res => res);

    const tags = input
      .tags(...args)(result)
      .filter(Boolean);
    await queryCache.set(queryString, result, tags);
    return result;
  };
};

type CreateWriteQueryInput<I, O> = $Exact<{
  query: (...args: I) => Promise<O> | O,
  invalidateTags: TagsFn<I, O>,
}>;

export const createWriteQuery = <I: Array<any>, O: any>(
  input: CreateWriteQueryInput<I, O>
) => {
  return async (...args: I) => {
    const query = await input.query(...args);
    if (typeof query.run === 'function') {
      throw new Error(
        `Call .run() on the query passed to createWriteQuery!

Bad: db.table('users').get(userId)
Good: db.table('users').get(userId).run()

If you need to post-process the result, simply use .then()! \`.run().then(result => /* ... */)!\`
`
      );
    }
    const result = await query();
    const tags = input
      .invalidateTags(...args)(result)
      .filter(Boolean);
    await queryCache.invalidate(...tags);
    return result;
  };
};
