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

// Have to replace : with nothing as that's what redis uses to group
// keys into folders. https://spectrum-asdf123.now.sh -> https//spectrum-asdf123.now.sh
const deploymentId =
  process.env.NOW_URL && process.env.NOW_URL.replace(':', '');
// Locally key the cache only with "cache:", when deployed key the cache with the
// deployment's NOW_URL to avoid serving HTML that refers to non-existant scripts.
// e.g. "cache:asdf123.now.sh:"
const getKeyPrefix = () => {
  if (!deploymentId) return 'cache:';

  return `cache:${deploymentId}:`;
};

const redis = createRedis({
  keyPrefix: getKeyPrefix(),
  ...config,
});

export default redis;
