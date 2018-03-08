// @flow
const debug = require('debug')('iris:subscriptions:notification');
import { withFilter } from 'graphql-subscriptions';
import { userIsMemberOfChannel } from './utils';
import { listenToUpdatedThreads } from '../models/thread';
import {
  getUserUsersChannels,
  getUsersPermissionsInChannels,
} from '../models/usersChannels';
import asyncify from '../utils/asyncify';
import UserError from '../utils/UserError';
import Raven from 'shared/raven';
import type { GraphQLContext } from '../';
import type { GraphQLResolveInfo } from 'graphql';

module.exports = {
  Subscription: {
    threadUpdated: {
      resolve: (thread: any) => thread,
      subscribe: async (
        _: any,
        { channelIds }: { channelIds: Array<string> },
        { user }: GraphQLContext,
        info: GraphQLResolveInfo
      ) => {
        if (!channelIds && (!user || !user.id))
          throw new UserError(
            'Please provide a list of channels to listen to when not signed in.'
          );

        let ids = channelIds;
        if (ids === undefined || ids === null) {
          // If no specific channels were passed listen to all the users channels
          const userChannels = await getUserUsersChannels(user.id);
          ids = userChannels.map(({ channelId }) => channelId);
        } else {
          // If specific channels were passed make sure the user has permission to listen in those channels
          const permissions = await getUsersPermissionsInChannels(
            ids.map(id => [user.id, id])
          );
          ids = permissions
            .filter(
              ({ isMember, isOwner, isModerator }) =>
                isMember === true || isOwner === true || isModerator === true
            )
            .map(({ channelId }) => channelId);
        }

        debug(
          `@${user.username || user.id} listening to new threads in ${
            ids.length
          } channels`
        );
        return asyncify(listenToUpdatedThreads(ids), {
          onError: err => {
            // Don't crash the whole API server on error in the listener
            console.error(err);
            Raven.captureException(err);
          },
          onClose: cursor => {
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
