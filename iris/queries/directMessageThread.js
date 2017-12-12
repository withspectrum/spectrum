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
      { first, after }: PaginationOptions,
      { user, loaders }: GraphQLContext
    ) => {
      if (!user || !user.id) return null;

      const canViewThread = await canViewDMThread(id, user.id, { loaders });
      if (!canViewThread) return null;

      const cursor = parseInt(decode(after), 10);
      const messages = await getMessages(id, {
        // NOTE(@mxstbr): We used to use first/after for reverse DM pagination
        // so we have to keep it that way for backwards compat, but really this
        // should be last/before since it's in the other way of time
        last: first || 30,
        before: cursor,
      });

      return {
        pageInfo: {
          hasNextPage: messages && messages.length >= first,
          // NOTE(@mxstbr): For DM threads we just assume there to be a previous page
          // if the user provided a cursor and there were at least some messages
          // That way they might get a false positive here if they request the messages before the last message
          // but since that query returns no messages this will be false and all will be well
          // (so it essentially just takes 1 “unnecessary” request to figure out whether or not there is a previous page)
          hasPreviousPage: messages && messages.length > 0 && !!cursor,
        },
        edges: messages.map((message, index) => ({
          cursor: encode(message.timestamp.getTime().toString()),
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
