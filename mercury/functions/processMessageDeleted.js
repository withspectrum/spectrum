// @flow
const debug = require('debug')('mercury:queue:process-reaction-deleted');
import { updateReputation } from '../models/usersCommunities';
import { getMessage } from '../models/message';
import { getThread } from '../models/thread';
import { getAllReactionsInThread } from '../models/reaction';
import {
  REACTION_DELETED,
  REACTION_DELETED_POST_AUTHOR_BONUS,
  REACTION_DELETED_SCORE,
  REACTION_DELETED_POST_AUTHOR_SCORE,
  MESSAGE_DELETED,
  MESSAGE_DELETED_POST_AUTHOR_BONUS,
  MESSAGE_DELETED_SCORE,
  MESSAGE_DELETED_POST_AUTHOR_SCORE,
} from '../constants';
import type { Data } from './types';

export default async (data: Data) => {
  // entityId represents the messageId
  const { entityId } = data;

  // get the message that the reaction was left on
  const { threadId, senderId, threadType } = await getMessage(entityId);

  // ignore messages deleted in DM threads - no rep was awarded there anyways
  if (threadType === 'directMessageThread') return;

  // get the original thread creator and communityId
  const { communityId, creatorId } = await getThread(threadId);

  // if any reactions were left on the message, for each of them remove the rep score given to the message creator and the bonus given to the post author
  const reactions = await getAllReactionsInThread([entityId]);
  if (reactions && reactions.length > 0) {
    reactions.map(r => {
      return Promise.all([
        updateReputation(
          senderId,
          communityId,
          REACTION_DELETED_SCORE,
          REACTION_DELETED
        ),
        updateReputation(
          creatorId,
          communityId,
          REACTION_DELETED_POST_AUTHOR_SCORE,
          REACTION_DELETED_POST_AUTHOR_BONUS
        ),
      ]);
    });
  }

  debug(`Processing message deleted reputation event`);
  debug(`Got communityId: ${communityId}`);
  return Promise.all([
    // remove reputation from the person who posted the message
    updateReputation(
      senderId,
      communityId,
      MESSAGE_DELETED_SCORE,
      MESSAGE_DELETED
    ),
    // remove reputation from the person who created the thread - smaller amount
    updateReputation(
      creatorId,
      communityId,
      MESSAGE_DELETED_POST_AUTHOR_SCORE,
      MESSAGE_DELETED_POST_AUTHOR_BONUS
    ),
  ]);
};
