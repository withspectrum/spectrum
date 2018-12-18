// @flow
// Log requests with debug
const debug = require('debug')('shared:middlewares:logging');

module.exports = (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  if (req.body && req.body.operationName) {
    debug(`requesting ${req.url}: ${req.body.operationName}`);
  } else {
    debug(`requesting ${req.url}`);
  }
  next();
};
