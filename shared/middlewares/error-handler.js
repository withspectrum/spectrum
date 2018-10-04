// @flow
import Raven from 'shared/raven';

export default (
  err: Error,
  req: express$Request,
  res: express$Response,
  next: express$NextFunction
) => {
  if (err) {
    console.error(err);
    res
      .status(500)
      .send(
        'Oops, something went wrong! Our engineers have been alerted and will fix this asap.'
      );
    Raven.captureException(err);
  } else {
    return next();
  }
};
