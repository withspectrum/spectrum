const debug = require('debug')('shared:raven');

let Raven;
if (process.env.NODE_ENV === 'production') {
  Raven = require('raven');
  Raven.config(
    'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
    {
      environment: process.env.NODE_ENV,
      name: process.env.SENTRY_NAME,
    }
  ).install();
} else {
  const noop = () => {};
  debug('mocking Raven in development');
  // Mock the Raven API in development
  Raven = {
    captureException: noop,
    setUserContext: noop,
    config: () => ({ install: noop }),
    requestHandler: (req, res, next) => next(),
    parsers: {
      parseRequest: noop,
    },
  };
}

export default Raven;
