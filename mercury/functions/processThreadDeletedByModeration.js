// @flow
const debug = require('debug')(
  'mercury:queue:process-thread-deleted-by-moderation'
);
import { updateReputation } from '../models/usersCommunities';
import { getThread } from '../models/thread';
import {
  THREAD_DELETED_BY_MODERATION,
  THREAD_DELETED_BY_MODERATION_SCORE,
} from '../constants';

export default async data => {
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
