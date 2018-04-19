import debugCreator from 'debug';
import requestIp from 'request-ip';
import ms from 'ms';
import Limiter from 'ratelimiter';
import createRedis from '../bull/create-redis';
import Raven from 'shared/raven';

const debug = debugCreator('shared:middlewares:rateLimiter');

const config =
  process.env.NODE_ENV === 'production' && !process.env.FORCE_DEV
    ? {
        port: process.env.REDIS_CACHE_PORT,
        host: process.env.REDIS_CACHE_URL,
        password: process.env.REDIS_CACHE_PASSWORD,
      }
    : undefined;

const redis = createRedis({
  keyPrefix: 'rateLimiter:',
  ...config,
});

const rateLimiter = (keyPrefix, max, duration) => {
  return (req, res, next) => {
    debug('request ', req.url);
    // if user is logged in than use his id, otherwise his ip address
    const id = req.isAuthenticated() ? req.user.id : requestIp.getClientIp(req);
    const limiterObj = new Limiter({
      id: `${keyPrefix}:${id}`,
      db: redis,
      max,
      duration,
    });
    limiterObj.get(function(err, limit) {
      if (err) return next(err);

      const remaining = limit.remaining - 1;
      res.set('X-RateLimit-Limit', limit.total);
      res.set('X-RateLimit-Remaining', remaining);
      res.set('X-RateLimit-Reset', limit.reset);

      // all good
      const after = (limit.reset - Date.now() / 1000) | 0;
      const remainingTime = ms(after * 1000, { long: true });
      debug(
        'remaining requests %s/%s in (%s) for userId: %s',
        remaining,
        limit.total,
        remainingTime,
        id
      );
      if (limit.remaining) return next();

      // not good
      Raven.captureMessage('Rate limit exceeded', {
        level: 'warning',
        extra: {
          requestUrl: req.url,
          userId: req.isAuthenticated() ? req.user.id : 'unauthenticated',
          ipAddress: requestIp.getClientIp(req),
        },
      });
      const delta = (limit.reset * 1000 - Date.now()) | 0;
      res.set('Retry-After', after);
      res
        .status(429)
        .send('Rate limit exceeded, retry in ' + ms(delta, { long: true }));
    });
  };
};

export default rateLimiter;
