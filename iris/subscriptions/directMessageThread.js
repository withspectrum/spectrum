// @flow
/**
 * Define the notification subscription resolvers
 */
import { withFilter } from 'graphql-subscriptions';
import { userCanViewDirectMessageThread } from './utils';
const {
  listenToUpdatedDirectMessageThreads,
} = require('../models/directMessageThread');
import asyncify from '../utils/asyncify';
import type { DBDirectMessageThread } from '../models/directMessageThread';

module.exports = {
  Subscription: {
    directMessageThreadUpdated: {
      resolve: (directMessageThread: DBDirectMessageThread) => ({
        ...directMessageThread,
        threadLastActive:
          directMessageThread.threadLastActive &&
          new Date(directMessageThread.threadLastActive),
      }),
      subscribe: withFilter(
        asyncify(listenToUpdatedDirectMessageThreads, err => {
          throw new Error(err);
        }),
        (directMessageThread, _, { user }) => {
          if (!user || !directMessageThread) return false;
          return userCanViewDirectMessageThread(
            directMessageThread.id,
            user.id
          );
        }
      ),
    },
  },
};
