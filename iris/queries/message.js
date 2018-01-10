// @flow
const { getMessage, getMediaMessagesForThread } = require('../models/message');
import { getThread } from '../models/thread';
import type { GraphQLContext } from '../';
import type { DBMessage } from 'shared/types';

module.exports = {
  Query: {
    message: (_: DBMessage, { id }: { id: string }) => getMessage(id),
    getMediaMessagesForThread: (_: any, { threadId }: { threadId: string }) =>
      getMediaMessagesForThread(threadId),
  },
  Message: {
    sender: async (
      { senderId, threadId, threadType }: DBMessage,
      _: any,
      { loaders }: GraphQLContext
    ) => {
      // there will be no community to resolve in direct message threads, so we can escape early
      // and only return the sender
      if (threadType === 'directMessageThread') {
        return loaders.user.load(senderId);
      }

      const [thread, sender] = await Promise.all([
        loaders.thread.load(threadId),
        loaders.user.load(senderId),
      ]);

      if (!thread || !sender) return null;

      const permissions = await loaders.userPermissionsInCommunity.load([
        senderId,
        thread.communityId,
      ]);

      return {
        ...sender,
        contextPermissions: {
          communityId: thread.communityId,
          reputation: permissions ? permissions.reputation : 0,
          isModerator: permissions ? permissions.isModerator : false,
          isOwner: permissions ? permissions.isOwner : false,
        },
      };
    },
    thread: ({ threadId }: { threadId: string }, _: any, __: any) =>
      getThread(threadId),
    reactions: ({ id }: DBMessage, _: any, { user, loaders }: GraphQLContext) =>
      loaders.messageReaction.load(id).then(result => {
        if (!result)
          return {
            count: 0,
            hasReacted: false,
          };
        const reactions = result.reduction;
        return {
          count: reactions.length,
          hasReacted: user
            ? reactions.some(reaction => reaction.userId === user.id)
            : false,
        };
      }),
    quotedMessage: (
      { quotedMessageId }: DBMessage,
      _: any,
      { loaders }: GraphQLContext
    ) => (quotedMessageId ? loaders.message.load(quotedMessageId) : null),
  },
};
