// @flow
import toobusy from 'toobusy-js';

// Middleware which blocks requests when the Node server is too busy
// now automatically retries the request at another instance of the server if it's too busy
export default (
  req: express$Request | http$IncomingMessage,
  res: express$Response | http$ServerResponse,
  next: express$NextFunction | (() => void)
) => {
  if (toobusy()) {
    res.statusCode = 503;
    res.end(
      'It looks like Spectrum is very busy right now, please try again in a minute.'
    );
  } else {
    next();
  }
};
