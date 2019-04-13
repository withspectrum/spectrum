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
      res.status(429);
      if (req.method === 'GET') {
        res.send(
          `<!DOCTYPE html><html><head><title>Spectrum</title> <style>body{margin: 0;}html{-webkit-font-smoothing: antialiased; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';}h1, p{line-height: 1.5;}.container{background: rgb(56,24,229);background: linear-gradient(90deg, rgba(56,24,229,1) 0%, rgba(56,24,229,0.8029586834733894) 52%, rgba(56,24,229,1) 100%); width: 100%; display: flex; height: 100vh; justify-content: center;}.item{color: white; font-weight: bold; align-self: center; text-align: center;}a{color: white;}span{font-size: 40px; padding: 0; margin: 0;}</style></head><body> <div class="container"> <div class="item"> <span>🚨</span> <h1>Rate Limit Exceeded</h1> <p>Try again in ${ms(
            delta,
            { long: true }
          )}. (if this was a mistake let us know at <a href="mailto:support@spectrum.chat">support@spectrum.chat</a>)</p></div></div></body></html>`
        );
      } else {
        res.send('Rate limit exceeded, retry in ' + ms(delta, { long: true }));
      }
    });
  };
};

export default rateLimiter;
