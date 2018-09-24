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
import queryCache from './query-cache';
import { READ_RUN_ERROR, WRITE_RUN_ERROR } from './constants';

let TOTAL_QUERIES = 0;
let CACHED_RESULTS = 0;

if (debug.enabled) {
  debug('Logging of cache hit rate enabled! (every 30s)');
  setInterval(() => {
    debug(
      `Cache hit rate: ${(CACHED_RESULTS / TOTAL_QUERIES) *
        100}% (${CACHED_RESULTS} cached of ${TOTAL_QUERIES} total)`
    );
  }, 30000);
}

type RethinkDBQuery<O> = {
  toString: Function,
  run: () => Promise<O>,
};

type ProcessFn<I, O> = (data: O) => Promise<*> | *;
type TagsFn<I, O> = (data: O) => Array<?string>;

type CreateReadQueryInput<I, O> = $Exact<{
  query: Promise<RethinkDBQuery<O>> | RethinkDBQuery<O>,
  process?: ProcessFn<I, O>,
  tags: TagsFn<I, O>,
}>;

type CreateQueryCallback<I, O> = (...args: I) => O;

export const createReadQuery = <I: Array<*>, O: *>(
  callback: (...args: I) => CreateReadQueryInput<I, O>
) => {
  return async (...args: I) => {
    const input = callback(...args);
    TOTAL_QUERIES++;
    const query = await input.query;
    if (typeof query.run !== 'function') throw new Error(READ_RUN_ERROR);

    const queryString = query.toString();
    const cached = await queryCache.get(queryString);
    if (cached) {
      CACHED_RESULTS++;
      return cached;
    }

    const result = await query
      .run()
      .then(input.process ? input.process : res => res);

    const tags = input.tags(result).filter(Boolean);
    await queryCache.set(queryString, result, tags);
    return result;
  };
};

type CreateWriteQueryInput<I, O> = $Exact<{
  query: Promise<O> | O,
  invalidateTags: TagsFn<I, O>,
}>;

export const createWriteQuery = <I: Array<*>, O: *>(
  callback: (...args: I) => CreateWriteQueryInput<I, O>
) => {
  return async (...args: I) => {
    const input = callback(...args);
    const result = await input.query;
    if (typeof result.run === 'function') throw new Error(WRITE_RUN_ERROR);

    const tags = input.invalidateTags(result).filter(Boolean);
    await queryCache.invalidate(...tags);
    return result;
  };
};
