// @flow
const debug = require('debug')('api:subscriptions:messages');
import { getThread } from '../models/thread';
import { getDirectMessageThread } from '../models/directMessageThread';
import { listenToNewMessages } from '../models/message';
import UserError from '../utils/UserError';
import asyncify from '../utils/asyncify';
import { userCanViewChannel, userCanViewDirectMessageThread } from './utils';
import { trackUserThreadLastSeenQueue } from 'shared/bull/queues.js';
import Raven from 'shared/raven';

const addMessageListener = asyncify(listenToNewMessages);

import type { GraphQLContext } from '../';

/**
 * Define the message subscription resolvers
 */
module.exports = {
  Subscription: {
    messageAdded: {
      resolve: (message: any) => message,
      subscribe: async (
        _: any,
        { thread }: { thread: string },
        { user }: GraphQLContext
      ) => {
        // Make sure the user has the permission to view the thread before
        // subscribing them to changes
        const [threadData, dmThreadData] = await Promise.all([
          getThread(thread),
          getDirectMessageThread(thread),
        ]);

        let canView = false;
        if (dmThreadData)
          canView = user
            ? await userCanViewDirectMessageThread(thread, user.id)
            : false;
        if (threadData)
          canView = await userCanViewChannel(
            threadData.channelId,
            user && user.id
          );

        const moniker = user ? `@${user.username || user.id}` : 'anonymous';
        if (!canView) {
          debug(
            `denying listener ${moniker}, tried listening to new messages in ${thread}`
          );
          return new UserError('Thread not found.');
        }

        debug(`${moniker} listening to new messages in ${thread}`);
        try {
          return addMessageListener({
            filter: message => {
              if (message.threadId === thread && user) {
                trackUserThreadLastSeenQueue.add({
                  userId: user.id,
                  threadId: message.threadId,
                  timestamp: new Date(message.timestamp).getTime() + 100,
                });
                return true;
              }

              return false;
            },
            onError: err => {
              // Don't crash the whole API server on error in the listener
              console.error(err);
              Raven.captureException(err);
            },
          });
        } catch (err) {
          console.error(err);
          Raven.captureException(err);
        }
      },
    },
  },
};
