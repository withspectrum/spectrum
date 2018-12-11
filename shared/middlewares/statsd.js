// @flow
import statsdMiddleware from 'express-statsd';
import { statsd } from '../statsd';

const middleware = statsdMiddleware({
  client: statsd,
});

export default (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  // Set a sensible default req.statsdKey, which is what will be shown in the DataDog UI. Example key:
  // hyperion.http.get.spectrum.general
  const pathname = req.path.replace(/\?.*/, '');
  // $FlowFixMe
  req.statsdKey = `http.${req.method.toLowerCase()}${pathname
    .toLowerCase()
    .replace('/', '.')}`;
  return middleware(req, res, next);
};
