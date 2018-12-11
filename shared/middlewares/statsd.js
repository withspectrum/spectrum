// @flow
const debug = require('debug')('shared:middlewares:statsd');
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

const log = () => {
  client.mockBuffer.forEach(item => {
    debug(item);
  });
  client.mockBuffer = [];
};

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
  // Log the StatsD metrics in development
  if (debug.enabled) res.once('finish', log);
  return middleware(req, res, next);
};
