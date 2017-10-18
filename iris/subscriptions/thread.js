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
      resolve: (thread: DBThread) => {
        // NOTE(@mxstbr): For some reason I have to wrap timestamp in new Date here. I have no idea why but otherwise message subscriptions don't work.
        return {
          ...thread,
          modifiedAt: thread.modifiedAt && new Date(thread.modifiedAt),
          createdAt: new Date(thread.createdAt),
          lastActive: new Date(thread.lastActive),
        };
      },
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
