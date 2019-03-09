// @flow
import Redis from 'ioredis';

const config =
  process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV
    ? {
        port: process.env.REDIS_CACHE_PORT,
        host: process.env.REDIS_CACHE_URL,
        password: process.env.REDIS_CACHE_PASSWORD,
      }
      : {
          host: process.env.REDIS_CACHE_URL,
      };

export default new Redis(config);
