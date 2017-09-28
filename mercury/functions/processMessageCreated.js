const debug = require('debug')('mercury:queue:process-message-created');
import { updateReputation } from '../models/usersCommunities';
import { getThread } from '../models/thread';
import {
  MESSAGE_CREATED,
  MESSAGE_CREATED_SCORE,
  MESSAGE_CREATED_POST_AUTHOR_SCORE,
  MESSAGE_CREATED_POST_AUTHOR_BONUS,
} from '../constants';

export default async data => {
  // entityId represents the threadId
  const { userId, entityId } = data;

  // get the communityId where the message was posted
  const { communityId, creatorId } = await getThread(entityId);

  // if the message creator and thread creator aren't the same person, give reputation to the message creator - this avoids people spamming their own threads to gain reputation
  const updateMessageCreatorReputation =
    userId !== creatorId
      ? await updateReputation(
          userId,
          communityId,
          MESSAGE_CREATED_SCORE,
          MESSAGE_CREATED
        )
      : Promise.resolve();

  // if the message creator and thread creator aren't the same person, give reputation to the thread creator - this avoids people spamming their own threads to gain reputation
  const updateThreadCreatorReputation =
    userId !== creatorId
      ? await updateReputation(
          creatorId,
          communityId,
          MESSAGE_CREATED_POST_AUTHOR_SCORE,
          MESSAGE_CREATED_POST_AUTHOR_BONUS
        )
      : Promise.resolve();

  debug(`Processing message created reputation event`);
  debug(`Got communityId: ${communityId}`);
  return Promise.all([
    // give reputation to the person who posted the message
    updateMessageCreatorReputation,
    // give reputation to the thread creator
    updateThreadCreatorReputation,
  ]);
};
