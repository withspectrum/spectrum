// @flow
import toobusy from 'toobusy-js';

// Middleware which blocks requests when the Node server is too busy
// now automatically retries the request at another instance of the server if it's too busy
export default (
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  // Don't send 503s in testing, that's dumb, just wait it out
  if (process.env.NODE_ENV !== 'testing' && !process.env.TEST_DB && toobusy()) {
    res.status(503);
    res.send(
      'It looks like Spectrum is very busy right now, please try again in a minute.'
    );
  } else {
    next();
  }
};
