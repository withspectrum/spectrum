// @flow
import TagCache from 'redis-tag-cache';

const IS_PROD = process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV;

const DEFAULT_REDIS_OPTIONS = {
  keyPrefix: 'query-cache',
};

const PRODUCTION_REDIS_OPTIONS = {
  port: process.env.REDIS_CACHE_PORT,
  host: process.env.REDIS_CACHE_URL,
  password: process.env.REDIS_CACHE_PASSWORD,
};

const queryCache = new TagCache({
  defaultTimeout: 86400,
  redis: {
    ...DEFAULT_REDIS_OPTIONS,
    ...(IS_PROD ? PRODUCTION_REDIS_OPTIONS : {}),
  },
});

export default queryCache;
