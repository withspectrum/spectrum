// @flow
// Log requests with debug
const debug = require('debug')('shared:middlewares:logging');

module.exports = (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  debug(`requesting ${req.url}`);
  next();
};
