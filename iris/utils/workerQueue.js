// @flow
// $FlowFixMe
import Raven from 'raven';
const createQueue = require('../../shared/bull/create-queue');
if (process.env.NODE_ENV !== 'development') {
  Raven.config(
    'https://3bd8523edd5d43d7998f9b85562d6924:d391ea04b0dc45b28610e7fad735b0d0@sentry.io/154812',
    {
      environment: process.env.NODE_ENV,
    }
  ).install();
}

export const addQueue = (name: string, data: any) => {
  const worker = createQueue(name);
  return worker.add({ ...data }).catch(err => Raven.captureException(err));
};
