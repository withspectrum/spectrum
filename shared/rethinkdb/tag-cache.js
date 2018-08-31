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

export type CacheData = ?(Object | string | Array<Object> | Array<string>);

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

  set = async (
    key: string,
    data: CacheData,
    tags: Array<string>
  ): Promise<void> => {
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

export default TagCache;
