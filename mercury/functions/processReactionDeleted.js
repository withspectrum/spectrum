// @flow
const debug = require('debug')('mercury:queue:process-reaction-deleted');
import { updateReputation } from '../models/usersCommunities';
import { getMessage } from '../models/message';
import { getThread } from '../models/thread';
import {
  REACTION_DELETED_SCORE,
  REACTION_DELETED_POST_AUTHOR_SCORE,
} from '../constants';

/*
  If a reaction was deleted, reverse any reputation given to the message creator and thread creator
*/
export default async data => {
  // entityId represents the messageId
  const { entityId } = data;

  // get the message that the reaction was left on
  const { threadId, senderId } = await getMessage(entityId);

  // get the original thread creator and communityId
  const { communityId, creatorId } = await getThread(threadId);

  debug(`Processing reaction created reputation event`);
  debug(`Got communityId: ${communityId}`);
  return Promise.all([
    // remove reputation from the person who posted the message
    updateReputation(senderId, communityId, REACTION_DELETED_SCORE),
    // remove reputation from the person who created the thread - smaller amount
    updateReputation(
      creatorId,
      communityId,
      REACTION_DELETED_POST_AUTHOR_SCORE
    ),
  ]);
};
