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

import TagCache, { type CacheData } from './tag-cache';

const queryCache = new TagCache('query-cache');

type CreateQueryInput<I, O> =
  | {|
      read: (
        ...args: I
      ) => {
        toString: Function,
        run: () => Promise<?O>,
      },
      tags: (...args: I) => (data: ?O) => Array<?string>,
    |}
  | {|
      write: (
        ...args: I
      ) => {
        toString: Function,
        run: () => Promise<?O>,
      },
      invalidateTags: (...args: I) => (data: ?O) => Array<?string>,
    |};

export const createQuery = <I: Array<any>, O: CacheData>(
  input: CreateQueryInput<I, O>
) => {
  const getQuery = input.read ? input.read : input.write;
  const getTags = input.tags ? input.tags : input.invalidateTags;

  return async (...args: I) => {
    // If we have a cached response return that asap...
    const query = getQuery(...args);
    const queryString = query.toString();
    const cached = await queryCache.get(queryString);
    if (cached) return cached;

    // ...otherwise run the query and calculate the tags
    const result = await query.run();
    const tags = getTags(...args)(result).filter(Boolean);
    // Then either invalidate the tags or store the result in the cache tagged with the calculated tags
    if (input.invalidateTags) {
      await queryCache.invalidate(tags);
    } else {
      await queryCache.set(queryString, result, tags);
    }
    return result;
  };
};
