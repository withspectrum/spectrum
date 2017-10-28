// @flow
/**
 * Define the thread subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import { userIsMemberOfChannel } from './utils';
const { listenToUpdatedThreads } = require('../models/thread');
import asyncify from '../utils/asyncify';
import type { DBThread } from '../models/thread';

module.exports = {
  Subscription: {
    threadUpdated: {
      resolve: (thread: any) => thread,
      subscribe: withFilter(
        asyncify(listenToUpdatedThreads, err => {
          throw new Error(err);
        }),
        async (thread, _, { user }) =>
          await userIsMemberOfChannel(thread.channelId, user && user.id)
      ),
    },
  },
};
