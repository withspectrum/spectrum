// @flow
import { withFilter } from 'graphql-subscriptions';
import { getThread } from '../models/thread';
import { userCanViewChannel, userCanViewDirectMessageThread } from './utils';
const { listenToNewMessages } = require('../models/message');
import asyncify from '../utils/asyncify';
import type { Message } from '../models/message';

/**
 * Define the message subscription resolvers
 */
module.exports = {
  Subscription: {
    messageAdded: {
      resolve: (message: any) => message,
      subscribe: withFilter(
        asyncify(listenToNewMessages, err => {
          throw new Error(err);
        }),
        async (message, { thread }, { user }) => {
          // Message was sent in different thread, early return
          if (message.threadId !== thread) return false;
          if (message.threadType === 'directMessageThread') {
            if (!user) return false;
            return userCanViewDirectMessageThread(message.threadId, user.id);
          }

          const threadData = await getThread(message.threadId);
          if (!threadData) return false;

          return await userCanViewChannel(
            threadData.channelId,
            user && user.id
          );
        }
      ),
    },
  },
};
