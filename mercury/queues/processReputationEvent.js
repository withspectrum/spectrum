// flow
const debug = require('debug')('mercury:queue:process-reputation-event');
import processThreadCreated from '../functions/processThreadCreated';
import processThreadDeleted from '../functions/processThreadDeleted';
import processMessageCreated from '../functions/processMessageCreated';
import processReactionCreated from '../functions/processReactionCreated';
import processReactionDeleted from '../functions/processReactionDeleted';
import processThreadReactionCreated from '../functions/processThreadReactionCreated';
import processThreadReactionDeleted from '../functions/processThreadReactionDeleted';
import processMessageDeleted from '../functions/processMessageDeleted';
import processThreadDeletedByModeration from '../functions/processThreadDeletedByModeration';
import Raven from 'shared/raven';
import {
  THREAD_CREATED,
  THREAD_DELETED,
  THREAD_DELETED_BY_MODERATION,
  MESSAGE_CREATED,
  MESSAGE_DELETED,
  REACTION_CREATED,
  REACTION_DELETED,
  THREAD_REACTION_CREATED,
  THREAD_REACTION_DELETED,
} from '../constants';
import type { Job, ReputationEventJobData } from 'shared/bull/types';

export default async (job: Job<ReputationEventJobData>) => {
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
      case THREAD_REACTION_CREATED: {
        return await processThreadReactionCreated(job.data);
      }
      case THREAD_REACTION_DELETED: {
        return await processThreadReactionDeleted(job.data);
      }
      case MESSAGE_DELETED: {
        return await processMessageDeleted(job.data);
      }
      default: {
        debug('❌ No reputation event type matched');
        return Promise.resolve();
      }
    }
  } catch (err) {
    console.error('❌ Error in job:\n');
    console.error(err);
    Raven.captureException(err);
  }
};
