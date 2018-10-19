// @flow
const debug = require('debug')('mercury:queue:process-reaction-deleted');
import { updateReputation } from '../models/usersCommunities';
import { getMessage } from '../models/message';
import { getThread } from '../models/thread';
import {
  REACTION_DELETED,
  REACTION_DELETED_POST_AUTHOR_BONUS,
  REACTION_DELETED_SCORE,
  REACTION_DELETED_POST_AUTHOR_SCORE,
} from '../constants';
import type { ReputationEventJobData } from 'shared/bull/types';

export default async (data: ReputationEventJobData) => {
  // entityId represents the messageId
  const { entityId } = data;

  // get the message that the reaction was left on
  const { threadId, senderId, threadType } = await getMessage(entityId);

  // ignore reactions left on messages in DMs
  if (threadType === 'directMessageThread') return;

  // get the original thread creator and communityId
  const { communityId, creatorId } = await getThread(threadId);

  debug(`Processing reaction created reputation event`);
  debug(`Got communityId: ${communityId}`);
  return Promise.all([
    // remove reputation from the person who posted the message
    updateReputation(
      senderId,
      communityId,
      REACTION_DELETED_SCORE,
      REACTION_DELETED
    ),
    // remove reputation from the person who created the thread - smaller amount
    updateReputation(
      creatorId,
      communityId,
      REACTION_DELETED_POST_AUTHOR_SCORE,
      REACTION_DELETED_POST_AUTHOR_BONUS
    ),
  ]);
};
