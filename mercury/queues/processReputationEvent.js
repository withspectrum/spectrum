// @flow
const debug = require('debug')('mercury:queue:process-reputation-event');
import processThreadCreated from '../functions/processThreadCreated';
import { THREAD_CREATED } from '../constants';

export default async job => {
  const { type, userId, entityId } = job.data;
  debug(`\nnew job: ${job.id}`);
  debug(`\nprocessing reputation type: ${type}`);
  debug(`\nprocessing reputation entityId: ${entityId}`);

  // if the event came in with bad data, escape
  if (!type || !userId || !entityId) return Promise.resolve();

  // parse event types
  switch (type) {
    case THREAD_CREATED: {
      return await processThreadCreated(job.data);
    }
    default: {
      debug('❌ No reputation event type matched');
      return Promise.resolve();
    }
  }
};
