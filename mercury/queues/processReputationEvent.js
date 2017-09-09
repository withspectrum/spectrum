// @flow
const debug = require('debug')('mercury:queue:process-reputation-event');
import { THREAD_CREATED } from './constants';

export default job => {
  const { type, userId, entityId } = job.data;
  debug(`\nnew job: ${job.id}`);
  debug(`\nprocessing reputation type: ${type}`);
  debug(`\nprocessing reputation entityId: ${entityId}`);

  // if the event came in with bad data, escape
  if (!type || !userId || !entityId) return Promise.resolve();

  //

  return Promise.resolve();
};
