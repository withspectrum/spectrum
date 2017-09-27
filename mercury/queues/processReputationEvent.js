const debug = require('debug')('mercury:queue:process-reputation-event');
import processThreadCreated from '../functions/processThreadCreated';
import processThreadDeleted from '../functions/processThreadDeleted';
import processMessageCreated from '../functions/processMessageCreated';
import processReactionCreated from '../functions/processReactionCreated';
import processReactionDeleted from '../functions/processReactionDeleted';
import processThreadDeletedByModeration from '../functions/processThreadDeletedByModeration';
import {
  THREAD_CREATED,
  THREAD_DELETED,
  THREAD_DELETED_BY_MODERATION,
  MESSAGE_CREATED,
  REACTION_CREATED,
  REACTION_DELETED,
} from '../constants';

export default async job => {
  const { type, userId, entityId } = job.data;
  debug(`\nnew job: ${job.id}`);
  debug(`\nprocessing reputation type: ${type}`);
  debug(`\nprocessing reputation entityId: ${entityId}`);

  // if the event came in with bad data, escape
  if (!type || !userId || !entityId) return Promise.resolve();

  // parse event types
  try {
    switch (type) {
      case THREAD_CREATED: {
        return await processThreadCreated(job.data);
      }
      case THREAD_DELETED: {
        return await processThreadDeleted(job.data);
      }
      case THREAD_DELETED_BY_MODERATION: {
        return await processThreadDeletedByModeration(job.data);
      }
      case MESSAGE_CREATED: {
        return await processMessageCreated(job.data);
      }
      case REACTION_CREATED: {
        return await processReactionCreated(job.data);
      }
      case REACTION_DELETED: {
        return await processReactionDeleted(job.data);
      }
      default: {
        debug('❌ No reputation event type matched');
        return Promise.resolve();
      }
    }
  } catch (err) {
    debug('❌ Error processing reputation event: ', err);
  }
};
