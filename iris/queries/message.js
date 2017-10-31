const { getMessage, getMediaMessagesForThread } = require('../models/message');
import { getReactions } from '../models/reaction';
import { getThread } from '../models/thread';
import type { GraphQLContext } from '../';

type GetMessageProps = {
  messageId: string,
};

type Root = {
  messageId: string,
  senderId: string,
  threadId: string,
  threadType: 'directMessageThread' | 'story',
};

module.exports = {
  Query: {
    message: (_: Root, { id }: GetMessageProps) => getMessage(id),
    getMediaMessagesForThread: (_, { threadId }) =>
      getMediaMessagesForThread(threadId),
  },
  Message: {
    sender: async (
      { senderId, threadId, threadType }: Root,
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
          reputation: permissions ? permissions.reputation : 0,
          isModerator: permissions ? permissions.isModerator : false,
          isOwner: permissions ? permissions.isOwner : false,
        },
      };
    },
    reactions: ({ id }: Root, _, { user }) =>
      getReactions(id).then(reactions => {
        return {
          count: reactions.length,
          hasReacted: user
            ? reactions.some(reaction => reaction.userId === user.id)
            : false,
        };
      }),
  },
};
