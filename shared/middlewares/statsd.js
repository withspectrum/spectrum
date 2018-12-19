// @flow
import statsdMiddleware from 'express-hot-shots';
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
  // hyperion.http.get
  // $FlowFixMe
  req.statsdKey = `http.${req.method.toLowerCase() || 'unknown_method'}`;
  return middleware(req, res, next);
};
