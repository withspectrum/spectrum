// @flow
// Log requests with debug
const debug = require('debug')('request');

module.exports = (req: Request, res: Response, next: Function) => {
  debug(`requesting ${req.url}`);
  next();
};
