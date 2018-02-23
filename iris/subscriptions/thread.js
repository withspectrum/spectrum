// @flow
const debug = require('debug')('iris:subscriptions:notification');
import { withFilter } from 'graphql-subscriptions';
import { userIsMemberOfChannel } from './utils';
import { listenToUpdatedThreads } from '../models/thread';
import { getUserUsersChannels } from '../models/usersChannels';
import asyncify from '../utils/asyncify';
import UserError from '../utils/UserError';
import type { GraphQLContext } from '../';
import type { GraphQLResolveInfo } from 'graphql';

module.exports = {
  Subscription: {
    threadUpdated: {
      resolve: (thread: any) => thread,
      subscribe: async (
        _: any,
        { thread }: { thread: string },
        { user }: GraphQLContext,
        info: GraphQLResolveInfo
      ) => {
        if (!user || !user.id)
          throw new UserError(
            'Cannot subscribe to updated threads when not signed in.'
          );

        const channels = await getUserUsersChannels(user.id);

        debug(`@${user.username || user.id} listening to new threads`);
        return asyncify(
          listenToUpdatedThreads(channels.map(({ channelId }) => channelId)),
          err => {
            throw new Error(err);
          }
        );
      },
    },
  },
};
