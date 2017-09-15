// @flow
// Log requests with debug
const debug = require('debug')('iris:web');

module.exports = (req: Request, res: Response, next: Function) => {
  debug(`requesting ${req.url}`);
  next();
};
