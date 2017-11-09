// @flow
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

const canViewDMThread = async (
  threadId: string,
  userId: string,
  { loaders }: { loaders: Object }
) => {
  if (!userId) return false;

  const result = await loaders.directMessageParticipants.load(threadId);
  if (!result || !result.reduction || result.reduction.length === 0)
    return false;

  const members = result.reduction;
  const ids = members.map(({ userId }) => userId);
  if (ids.indexOf(userId) === -1) return false;

  return true;
};

module.exports = {
  Query: {
    directMessageThread: async (
      _: any,
      { id }: { id: string },
      { user, loaders }: GraphQLContext
    ) => {
      // signed out users should never be able to request a dm thread
      if (!user || !user.id) return null;

      const canViewThread = await canViewDMThread(id, user.id, { loaders });

      if (!canViewThread) return null;

      return loaders.directMessageThread.load(id);
    },
  },
  DirectMessageThread: {
    messageConnection: async (
      { id }: { id: string },
      { first = 30, after }: PaginationOptions,
      { user, loaders }: GraphQLContext
    ) => {
      if (!user || !user.id) return null;

      const canViewThread = await canViewDMThread(id, user.id, { loaders });

      if (!canViewThread) return null;

      const cursor = decode(after);
      // $FlowFixMe
      const messages = await getMessages(id, {
        first,
        after: cursor,
      });

      const paginated = paginate(
        messages.reverse(),
        { first, after: cursor },
        message => message.id === cursor
      );

      return {
        pageInfo: {
          hasNextPage: paginated.hasMoreItems,
        },
        edges: paginated.list.map(message => ({
          cursor: encode(message.id),
          node: message,
        })),
      };
    },
    participants: async (
      { id }: { id: string },
      _: any,
      { loaders, user }: GraphQLContext
    ) => {
      if (!user || !user.id) return null;

      const canViewThread = await canViewDMThread(id, user.id, { loaders });

      if (!canViewThread) return null;

      return loaders.directMessageParticipants.load(id).then(results => {
        if (!results || results.length === 0) return null;
        return results.reduction;
      });
    },
    snippet: async (
      { id }: { id: string },
      _: any,
      { loaders, user }: GraphQLContext
    ) => {
      if (!user || !user.id) return null;

      const canViewThread = await canViewDMThread(id, user.id, { loaders });

      if (!canViewThread) return null;

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
