// @flow
const debug = require('debug')('iris:subscriptions:messages');
import { getThread } from '../models/thread';
import { getDirectMessageThread } from '../models/directMessageThread';
import { userCanViewChannel, userCanViewDirectMessageThread } from './utils';
import asyncify from '../utils/asyncify';
import { listenToNewMessagesInThread } from '../models/message';
import { trackUserThreadLastSeenQueue } from 'shared/bull/queues.js';
import UserError from '../utils/UserError';
import Raven from 'shared/raven';

import type { Message } from '../models/message';
import type { GraphQLContext } from '../';
import type { GraphQLResolveInfo } from 'graphql';

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
        { user }: GraphQLContext,
        info: GraphQLResolveInfo
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
          throw new UserError('Thread not found.');
        }

        debug(`${moniker} listening to new messages in ${thread}`);
        return asyncify(listenToNewMessagesInThread(thread), {
          onError: err => {
            // Don't crash the whole API server on error in the listener
            console.error(err);
            Raven.captureException(err);
          },
          onClose: cursor => {
            // Once the user unsubscribes record a new threadLastSeen
            if (user && user.id) {
              trackUserThreadLastSeenQueue.add({
                threadId: thread,
                userId: user.id,
                timestamp: Date.now(),
              });
            }
            if (cursor) {
              /* ignore errors that happen when closing the cursor */
              try {
                cursor.close(() => {});
              } catch (err) {}
            }
          },
        });
      },
    },
  },
};
