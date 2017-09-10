// @flow
const debug = require('debug')('mercury:queue:process-thread-created');
import { updateReputation } from '../models/usersCommunities';
import { getThread } from '../models/thread';
import {
  MESSAGE_CREATED_SCORE,
  MESSAGE_CREATED_POST_AUTHOR_SCORE,
} from '../constants';

export default async data => {
  // entityId represents the threadId
  const { userId, entityId } = data;

  // get the communityId where the message was posted
  const { communityId, creatorId } = await getThread(entityId);

  debug(`Processing message created reputation event`);
  debug(`Got communityId: ${communityId}`);
  return Promise.all([
    // give reputation to the person who posted the message
    updateReputation(userId, communityId, MESSAGE_CREATED_SCORE),
    // give reputation to the thread creator
    updateReputation(creatorId, communityId, MESSAGE_CREATED_POST_AUTHOR_SCORE),
  ]);
};
