// @flow
// Cache unauthenticated requests in Redis
import createRedis from 'shared/bull/create-redis';
const debug = require('debug')('hyperion:cache');

const config =
  process.env.NODE_ENV === 'production'
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

const cache = (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  if (req.method !== 'GET') {
    debug(`${req.method} request came in, not caching`);
    return next();
  }
  if (req.user) {
    req.user.id &&
      typeof req.user.id === 'string' &&
      debug(`authenticated request by ${req.user.id}, not checking cache`);
    return next();
  }

  // NOTE(@mxstbr): Using req.path here (instead of req.url or req.originalUrl) to avoid sending unique pages
  // for query params, i.e. /spectrum?bla=xyz will be treated the same as /spectrum
  const key = req.path;
  debug(`unauthenticated request, checking cache for ${req.path}`);
  redis.get(key).then(result => {
    if (result) {
      debug(`cached html found, sending to user`);
      return res.send(result);
    }

    debug(`no result in cache found, monkey-patching res.send`);
    // $FlowFixMe
    res.originalSend = res.send;
    // $FlowFixMe
    res.send = (...args) => {
      debug(`monkey-patched res.send called`);
      if (res.statusCode > 199 && res.statusCode < 300) {
        debug(`successful render, caching at ${req.path}`);
        redis.set(key, ...args, 'ex', 3600);
      } else {
        debug(
          `unsuccessful render (status code: ${res.statusCode}), not caching`
        );
      }
      // $FlowFixMe
      res.originalSend(...args);
    };
    next();
  });
};

export default cache;
