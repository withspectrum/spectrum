// @flow
import TagCache from 'redis-tag-cache';

const DEFAULT_REDIS_OPTIONS = {
  keyPrefix: 'query-cache',
};

const queryCache = new TagCache({
  defaultTimeout: 86400,
  redis: {
    ...DEFAULT_REDIS_OPTIONS,
  },
});

export default queryCache;
