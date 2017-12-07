// @flow
// Cache unauthenticated requests in Redis
import createRedis from 'shared/bull/create-redis';
const debug = require('debug')('hyperion:cache');

const redis = createRedis();

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

  const key = `__cache__${req.originalUrl || req.url}`;
  debug(`unauthenticated request, checking cache for ${key}`);
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
      debug(`monkey-patched res.send called, caching at ${key}`);

      redis.set(key, ...args, 'ex', 3600);
      // $FlowFixMe
      res.originalSend(...args);
    };
    next();
  });
};

export default cache;
