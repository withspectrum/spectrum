// @flow
// $FlowFixMe
import Raven from 'raven';
const createQueue = require('../../shared/bull/create-queue');

export const addQueue = (name: string, data: any) => {
  const worker = createQueue(name);
  try {
    worker.add({ ...data });
  } catch (err) {
    Raven.captureException(err);
  }
};
