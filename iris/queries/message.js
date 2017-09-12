//@flow
const { getMessage, getMediaMessagesForThread } = require('../models/message');
import { getReactions } from '../models/reaction';
import { getThread } from '../models/thread';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import type { GraphQLContext } from '../';

type GetMessageProps = {
  messageId: string,
};

type Root = {
  messageId: string,
  senderId: string,
};

module.exports = {
  Query: {
    message: (_: Root, { id }: GetMessageProps) => getMessage(id),
    getMediaMessagesForThread: (_, { threadId }) =>
      getMediaMessagesForThread(threadId),
  },
  Message: {
    sender: async (
      { senderId, threadId }: Root,
      _: any,
      { loaders }: GraphQLContext
    ) => {
      const sender = await loaders.user.load(senderId);
      const { communityId } = await getThread(threadId);
      const {
        reputation,
        isModerator,
        isOwner,
      } = await getUserPermissionsInCommunity(communityId, senderId);

      return {
        ...sender,
        contextPermissions: {
          reputation,
          isModerator,
          isOwner,
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
