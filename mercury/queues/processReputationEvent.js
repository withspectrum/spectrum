// @flow
const debug = require('debug')('mercury:queue:process-reputation-event');
import { THREAD_CREATED } from './constants';

export default job => {
  const { type, userId, entityId } = job.data;
  debug(`\nnew job: ${job.id}`);
  debug(`\nprocessing reputation type: ${type}`);
  debug(`\nprocessing reputation entityId: ${entityId}`);

  return Promise.resolve();
};
