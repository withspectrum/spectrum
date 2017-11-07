const { getDirectMessageThread } = require('../models/directMessageThread');
const {
  getMembersInDirectMessageThread,
} = require('../models/usersDirectMessageThreads');
const { getLastMessage, getMessages } = require('../models/message');
import paginate from '../utils/paginate-arrays';
import type { PaginationOptions } from '../utils/paginate-arrays';
import type { GraphQLContext } from '../';
import { encode, decode } from '../utils/base64';
import { toPlainText, toState } from 'shared/draft-utils';

type DirectMessageUser = {
  userId: any,
  lastSeen: Date,
  lastActivity: Date,
};

module.exports = {
  Query: {
    directMessageThread: async (
      _: any,
      { id }: { id: String },
      { user, loaders }: GraphQLContext
    ) => {
      // signed out users should never be able to request a dm thread
      if (!user || !user.id) return null;

      // get the members of this thread
      const members = await loaders.directMessageParticipants.load(id);

      // if there are no members, abort
      if (!members || members.length === 0) return null;

      // if user viewing the dm thread is not a member of the thread, abort!
      const memberIds = members.reduction.map(u => u.userId);
      if (memberIds.indexOf(user.id) < 0) return null;

      return loaders.directMessageThread.load(id);
    },
  },
  DirectMessageThread: {
    messageConnection: (
      { id }: { id: String },
      { first = 30, after }: PaginationOptions
    ) => {
      const cursor = decode(after);
      return getMessages(id, {
        first,
        after: cursor,
      })
        .then(messages => messages.reverse())
        .then(messages =>
          paginate(
            messages,
            { first, after: cursor },
            message => message.id === cursor
          )
        )
        .then(result => ({
          pageInfo: {
            hasNextPage: result.hasMoreItems,
          },
          edges: result.list.map(message => ({
            cursor: encode(message.id),
            node: message,
          })),
        }));
    },
    participants: ({ id }, _, { loaders, user }) => {
      return loaders.directMessageParticipants.load(id).then(results => {
        if (!results || results.length === 0) return null;
        return results.reduction;
      });
    },
    snippet: ({ id }, _: any, { loaders }: GraphQLContext) => {
      return loaders.directMessageSnippet.load(id).then(results => {
        if (!results) return 'No messages yet...';
        const message = results.reduction;
        return message.messageType === 'draftjs'
          ? toPlainText(toState(JSON.parse(message.content.body)))
          : message.content.body;
      });
    },
  },
};
