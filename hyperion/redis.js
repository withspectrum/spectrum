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

// Turn the NOW_URL into the deployment ID
// https://spectrum-asdf123.now.sh -> spectrum-asdf123
const deploymentId =
  process.env.NOW_URL &&
  process.env.NOW_URL.replace(/^https:\/\//, '').replace(/\.now\.sh$/, '');
// Locally key the cache only with "cache:", when deployed key the cache with the
// deployment's NOW_URL to avoid serving HTML that refers to non-existant scripts.
// e.g. "cache:spectrum-asdf123:"
const getKeyPrefix = () => {
  if (!deploymentId) return 'cache:';

  return `cache:${deploymentId}:`;
};

const redis = createRedis({
  keyPrefix: getKeyPrefix(),
  ...config,
});

export default redis;
