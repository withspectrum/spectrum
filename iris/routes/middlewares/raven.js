// @flow
import Raven from 'raven';

Raven.config(
  'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
  {
    environment: process.env.NODE_ENV,
  }
).install();

export default Raven.requestHandler();
