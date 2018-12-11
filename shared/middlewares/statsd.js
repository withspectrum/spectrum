// @flow
import statsdMiddleware from 'express-statsd';
import StatsD from 'hot-shots';

export const client = new StatsD({
  mock: process.env.NODE_ENV !== 'production',
  prefix: `${process.env.SENTRY_NAME || 'server'}.`,
});

client.socket.on('error', function(error) {
  console.error('Error in socket: ', error);
});

const middleware = statsdMiddleware({
  client,
});

export default (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  // Set a sensible default req.statsdKey, which is what will be shown in the DataDog UI. Example key:
  // hyperion.http.get.spectrum.general
  const pathname = req.path.replace(/\?.*/, '');
  req.statsdKey = `http.${req.method.toLowerCase()}${pathname
    .toLowerCase()
    .replace('/', '.')}`;
  return middleware(req, res, next);
};
