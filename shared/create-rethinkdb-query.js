/* @flow
 *
 * TagCache
 * Allows one to cache data with tags and invalidate based on them
 *
 * Under the hood this stores one set of keys per tag (ID) and the data per key in Redis:
 * - `tags:asdf-123` = `db.table('threads').get('asdf-345') db.table('threads').get('asdf-234') ...`
 * - `data:db.table('threads').get('asdf-345')` = `{ "id": "asdf-345", "content": { "title": "Hello" }, ... }`
 */

import Redis from 'ioredis';

type Data = ?(Object | string | Array<Object> | Array<string>);

class TagCache {
  redis: Redis;

  constructor(keyPrefix: string) {
    this.redis = new Redis({ keyPrefix });
  }

  get = async (key: string): Promise<?mixed> => {
    try {
      return this.redis.get(`data:${key}`);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  set = async (key: string, data: Data, tags: Array<string>): Promise<void> => {
    try {
      // NOTE(@mxstbr): This is a multi execution because if any of the commands is invalid
      // we don't want to execute anything
      const multi = await this.redis.multi();

      // Add the key to each of the tag sets
      tags.forEach(tag => {
        multi.sadd(`tags:${tag}`, key);
      });

      // Add the data to the key
      multi.set(`data:${key}`, data);
      await multi.exec();
      return;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  invalidate = async (tags: Array<string>): Promise<void> => {
    try {
      // NOTE(@mxstbr): This is a pipeline because we don't want to stop invalidating all tags
      // just because one might be invalid
      const pipeline = await this.redis.pipeline();

      tags.forEach(tag => {
        pipeline.del(`tags:${tag}`);
      });

      await pipeline.exec();
    } catch (err) {
      return Promise.reject(err);
    }
  };
}

/*
 * createQuery
 * Create a RethinkDB query and cache it's result in a TagCache
 */

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

export const createQuery = <I: Array<any>, O: Data>(
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

/*
 * Usage
 */

import type { DBThread } from 'shared/types';

// Read query
const getThreadsByCommunityId = createQuery({
  read: (communityId: string) =>
    db.table('threads').getAll(communityId, { index: 'communityId' }),
  tags: (communityId: string) => (threads: ?Array<DBThread>) => [
    communityId,
    ...(threads || []).map(thread => thread.id),
    ...(threads || []).map(thread => thread.channelId),
  ],
});

// Write query
const publishThread = createQuery({
  write: (communityId: string, channelId: string, content: Object) =>
    db.table('threads').insert({ communityId, channelId, content }),
  invalidateTags: (communityId: string, channelId: string) => (
    thread: ?DBThread
  ) => [communityId, channelId, thread && thread.id],
});
