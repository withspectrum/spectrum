/* @flow
 *
 * TagCache
 * Allows one to cache data with tags and invalidate based on them
 *
 * Under the hood this stores one set of keys per tag (ID) and the data per key in Redis:
 * - `tags:asdf-123` = `db.table('threads').get('asdf-345') db.table('threads').get('asdf-234') ...`
 * - `data:db.table('threads').get('asdf-345')` = `{ "id": "asdf-345", "content": { "title": "Hello" }, ... }`
 */

import Redis, { type RedisOptions } from 'ioredis';

export type CacheData = ?(Object | string | Array<*>);

class TagCache {
  redis: Redis;

  constructor(options: ?RedisOptions) {
    this.redis = new Redis(options || {});
  }

  get = async (key: string): Promise<?CacheData> => {
    try {
      return this.redis.get(`data:${key}`).then(res => {
        try {
          return JSON.parse(res);
        } catch (err) {
          return res;
        }
      });
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
      multi.set(`data:${key}`, JSON.stringify(data));
      await multi.exec();
      return;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  // How invalidation by tag works:
  // 1. Get all the keys associated with all the passed-in tags (tags:${tag})
  // 2. Delete all the keys data (data:${key})
  // 3. Delete all the tags (tags:${tag})
  invalidate = async (tags: Array<string>): Promise<void> => {
    try {
      // NOTE(@mxstbr): [].concat.apply([],...) flattens the array
      const keys = [].concat.apply(
        [],
        await Promise.all(tags.map(tag => this.redis.smembers(`tags:${tag}`)))
      );

      const pipeline = await this.redis.pipeline();

      keys.forEach(key => {
        pipeline.del(`data:${key}`);
      });

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
