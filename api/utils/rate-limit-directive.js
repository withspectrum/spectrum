// @flow
import { createRateLimitDirective, RedisStore } from 'graphql-rate-limit';
import { getClientIp } from 'request-ip';
import createRedis from 'shared/bull/create-redis';
import ms from 'ms';

export default createRateLimitDirective({
  identifyContext: ctx => (ctx.user && ctx.user.id) || getClientIp(ctx.request),
  store: new RedisStore(createRedis()),
  formatError: ({ fieldName, fieldIdentity, max, window }) =>
    `Slow down there partner! You've called '${fieldName}' ${max} times in the past ${ms(
      window,
      { long: true }
    )}. Relax for a bit and try again later.`,
});
