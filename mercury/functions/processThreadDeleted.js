// @flow
const debug = require('debug')('mercury:queue:process-thread-deleted');
import { updateReputation } from '../models/usersCommunities';
import { getThread } from '../models/thread';
import { THREAD_DELETED_SCORE } from '../constants';

export default async data => {
  // entityId represents the communityId
  const { userId, entityId } = data;
  const communityId = entityId;

  debug(`Processing thread deleted reputation event`);
  debug(`Got communityId: ${communityId}`);
  return updateReputation(userId, communityId, THREAD_DELETED_SCORE);
};
