// @flow
const debug = require('debug')('mercury:queue:process-thread-reaction-created');
import { updateReputation } from '../models/usersCommunities';
import { getThread } from '../models/thread';
import {
  THREAD_REACTION_CREATED,
  THREAD_REACTION_CREATED_SCORE,
} from '../constants';
import type { ReputationEventJobData } from 'shared/bull/types';

export default async (data: ReputationEventJobData) => {
  // entityId represents the threadId
  const { entityId } = data;
  const { communityId, creatorId } = await getThread(entityId);

  debug(`Processing thread reaction created reputation event`);
  debug(`Got communityId: ${communityId}`);
  return updateReputation(
    creatorId,
    communityId,
    THREAD_REACTION_CREATED_SCORE,
    THREAD_REACTION_CREATED
  );
};
