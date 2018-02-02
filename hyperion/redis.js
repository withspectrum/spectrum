// @flow
import createRedis from 'shared/bull/create-redis';

const config =
  process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV
    ? {
        port: process.env.REDIS_CACHE_PORT,
        host: process.env.REDIS_CACHE_URL,
        password: process.env.REDIS_CACHE_PASSWORD,
      }
    : undefined;

const redis = createRedis({
  keyPrefix: 'cache:',
  ...config,
});

export default redis;
