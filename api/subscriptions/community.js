// @flow
const debug = require('debug')('api:subscriptions:community');
import { listenToUpdatedCommunities } from '../models/community';
import { getUsersPermissionsInCommunities } from '../models/usersCommunities';
import { getCommunitiesByUser } from '../models/community';
import asyncify from '../utils/asyncify';
import UserError from '../utils/UserError';
import Raven from 'shared/raven';
import type { GraphQLContext } from '../';

const addCommunityListener = asyncify(listenToUpdatedCommunities);

module.exports = {
  Subscription: {
    communityUpdated: {
      resolve: (community: any) => community,
      subscribe: async (
        _: any,
        { communityIds }: { communityIds: Array<string> },
        { user }: GraphQLContext
      ) => {
        if (!communityIds && (!user || !user.id))
          return new UserError(
            'Please provide a list of channels to listen to when not signed in.'
          );

        let ids = communityIds;
        if (ids === undefined || ids === null) {
          // If no specific communities were passed listen to all the users communities
          const usersCommunities = await getCommunitiesByUser(user.id);
          ids = usersCommunities.map(({ id }) => id);
        } else {
          // If specific communities were passed make sure the user has permission to those communities
          const permissions = await getUsersPermissionsInCommunities(
            ids.map(id => [user ? user.id : null, id])
          );
          ids = permissions
            .filter(
              ({ isMember, isOwner, isModerator }) =>
                isMember === true || isOwner === true || isModerator === true
            )
            .map(({ communityId }) => communityId);
        }

        debug(
          `@${user.username || user.id} listening to ${
            ids.length
          } communities updates`
        );
        return addCommunityListener({
          filter: community => community && ids.includes(community.id),
          onError: err => {
            // Don't crash the whole API server on error in the listener
            console.error(err);
            Raven.captureException(err);
          },
        });
      },
    },
  },
};
