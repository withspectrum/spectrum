// @flow
const debug = require('debug')('mercury:queue:process-thread-deleted');
import { updateReputation } from '../models/usersCommunities';
import { getThread } from '../models/thread';
import { getMessagesByThreadId, getMessage } from '../models/message';
import { getAllReactionsInThread } from '../models/reaction';
import {
  THREAD_DELETED_SCORE,
  MESSAGE_DELETED_SCORE,
  MESSAGE_DELETED_POST_AUTHOR_SCORE,
  REACTION_DELETED_SCORE,
  REACTION_DELETED_POST_AUTHOR_SCORE,
} from '../constants';

/*
  If a thread is deleted, not only do we need to remove the reputation from the post author, but we also need to remove all of the reputation that was gained by users within the thread:

  1. Each time a message was posted, the message creator and thread creator gained reputation
  2. Eeach reaction within the thread generated reptuation for the message sender and message creator

*/

export default async data => {
  // entityId represents the threadId
  const { userId, entityId } = data;

  // get the community where the thread was posted
  const { communityId, creatorId } = await getThread(entityId);
  const threadCreatorId = creatorId;

  // get the messages posted in the thread
  const messages = await getMessagesByThreadId(entityId);

  const messagesByNonAuthor = messages.filter(
    message => message.senderId !== threadCreatorId
  );
  debug(messagesByNonAuthor);

  // for each message, remove the reputation for the message creator
  const removeMessagesReputation =
    messagesByNonAuthor.length > 0
      ? messagesByNonAuthor.map(message =>
          updateReputation(message.senderId, communityId, MESSAGE_DELETED_SCORE)
        )
      : messages;

  debug(removeMessagesReputation);

  const removeMessagesReputationPromises = await Promise.all(
    removeMessagesReputation
  );
  debug(removeMessagesReputationPromises);

  // convert all the messages into an array of messageIds in order to efficiently fetch reactions
  const messageIds =
    messagesByNonAuthor.length > 0 ? messages.map(message => message.id) : [];

  // get any reactions left on any of the messages in the thread
  const reactions =
    messageIds.length > 0 ? await getAllReactionsInThread(messageIds) : [];

  const removeReactionsReputation =
    reactions.length > 0
      ? reactions.map(async reaction => {
          const { senderId } = await getMessage(reaction.messageId);

          // don't remove extra reaction bonuses
          if (senderId === threadCreatorId) return;

          return updateReputation(
            senderId,
            communityId,
            REACTION_DELETED_SCORE
          );
        })
      : reactions;

  const removeReactionsReputationPromises = await Promise.all(
    removeReactionsReputation
  );

  debug(`Processing thread deleted reputation event`);
  debug(`Got communityId: ${communityId}`);
  return Promise.all([
    // delete the reputation from the thread creator
    updateReputation(threadCreatorId, communityId, THREAD_DELETED_SCORE),
    // delete the reputation the thread author gained for each message left on the thread
    updateReputation(
      threadCreatorId,
      communityId,
      MESSAGE_DELETED_POST_AUTHOR_SCORE * messages.length
    ),
    // delete the reputation the thread author gained for each reaction left on messages in the thread
    updateReputation(
      threadCreatorId,
      communityId,
      REACTION_DELETED_POST_AUTHOR_SCORE * reactions.length
    ),
    // delete the reputation for each message left on the thread
    messages.length > 0 && removeMessagesReputationPromises,
    // delete the reputation gained by each message creator from reactions
    reactions.length > 0 && removeReactionsReputationPromises,
  ]);
};
