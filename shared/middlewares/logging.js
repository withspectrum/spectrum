// @flow
// Log requests with debug
const debug = require('debug')('request');

module.exports = (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  debug(`requesting ${req.url}`);
  next();
};
