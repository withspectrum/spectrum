// @flow
const debug = require('debug')('mercury:queue:process-thread-reaction-deleted');
import { updateReputation } from '../models/usersCommunities';
import { getThread } from '../models/thread';
import {
  THREAD_REACTION_DELETED,
  THREAD_REACTION_DELETED_SCORE,
} from '../constants';
import type { ReputationEventJobData } from 'shared/bull/types';

export default async (data: ReputationEventJobData) => {
  // entityId represents the threadId
  const { entityId } = data;
  const { creatorId, communityId } = await getThread(entityId);

  debug(`Processing thread reaction deleted reputation event`);
  debug(`Got communityId: ${communityId}`);
  return updateReputation(
    creatorId,
    communityId,
    THREAD_REACTION_DELETED_SCORE,
    THREAD_REACTION_DELETED
  );
};
