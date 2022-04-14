// @flow
const debug = require('debug')(
  'mercury:queue:process-thread-deleted-by-moderation'
);
import { updateReputation } from '../models/usersCommunities';
import {
  THREAD_DELETED_BY_MODERATION,
  THREAD_DELETED_BY_MODERATION_SCORE,
} from '../constants';
import type { ReputationEventJobData } from 'shared/bull/types';

export default async (data: ReputationEventJobData) => {
  // entityId represents the communityId
  const { userId, entityId } = data;
  const communityId = entityId;

  debug(`Processing thread deleted by moderation reputation event`);
  debug(`Got communityId: ${communityId}`);
  return updateReputation(
    userId,
    communityId,
    THREAD_DELETED_BY_MODERATION_SCORE,
    THREAD_DELETED_BY_MODERATION
  );
};
