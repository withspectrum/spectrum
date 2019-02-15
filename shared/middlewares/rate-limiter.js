// @flow
const debug = require('debug')('shared:middlewares:ratelimiter');
import requestIp from 'request-ip';
import ms from 'ms';
import Limiter from 'ratelimiter';
import createRedis from '../bull/create-redis';
import Raven from 'shared/raven';

const server = process.env.SENTRY_NAME || 'unnamed';
const redis = createRedis({
  keyPrefix: 'request-rate-limit:',
});

const rateLimiter = ({ max, duration }: { max: number, duration: string }) => {
  return (
    req: express$Request,
    res: express$Response,
    next: express$NextFunction
  ) => {
    // if user is logged in than use their id, otherwise use their ip address
    const id =
      req.user && req.user.id ? req.user.id : requestIp.getClientIp(req);
    const limiter = new Limiter({
      // $FlowIssue
      id: `${server}:${id}`,
      db: redis,
      max,
      duration: ms(duration),
    });

    limiter.get(function(err, limit) {
      if (err) return next(err);

      const remaining = limit.remaining - 1;
      res.set('X-RateLimit-Limit', String(limit.total));
      res.set('X-RateLimit-Remaining', String(remaining));
      res.set('X-RateLimit-Reset', String(limit.reset));

      const after = (limit.reset - Date.now() / 1000) | 0;
      const remainingTime = ms(after * 1000, { long: true });
      debug(
        '%s of %s requests remaining in the next %s, userId: %s',
        remaining,
        limit.total,
        remainingTime,
        id
      );
      if (limit.remaining) return next();

      const delta = (limit.reset * 1000 - Date.now()) | 0;
      res.set('Retry-After', String(after));
      res
        .status(429)
        .send('Rate limit exceeded, retry in ' + ms(delta, { long: true }));
    });
  };
};

export default rateLimiter;
