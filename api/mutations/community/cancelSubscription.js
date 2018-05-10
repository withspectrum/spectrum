// @flow
const debug = require('debug')('api:mutations:community:add-payment-source');
import type { GraphQLContext } from '../../';
import { removeModeratorsInCommunity } from '../../models/usersCommunities';
import {
  disablePaidFeatureFlags,
  getCommunityById,
} from '../../models/community';
import { archiveAllPrivateChannels } from '../../models/channel';
import UserError from '../../utils/UserError';
import { StripeUtil } from 'shared/stripe/utils';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';

export default async (
  _: any,
  { input }: { input: { communityId: string } },
  { user }: GraphQLContext
) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to manage this community');
  }

  const { communityId } = input;

  const { customer, community } = await StripeUtil.jobPreflight(communityId);

  const currentUserCommunityPermissions = await getUserPermissionsInCommunity(
    communityId,
    currentUser.id
  );

  if (!currentUserCommunityPermissions.isOwner) {
    return new UserError(
      'You must own this community to manage payment sources'
    );
  }

  if (!community) {
    debug('Error getting community in preflight');
    return new UserError(
      'We had trouble processing this request - please try again later'
    );
  }

  if (!customer) {
    debug('Error getting customer in preflight');
    return new UserError(
      'We had trouble processing this request - please try again later'
    );
  }

  // in the mutation we only need to update the records relating to the community
  // in the db. Pluto will receive queue jobs for each change and reconcile
  // with stripe asynchronosouly. As a result, there is a small delay between
  // when the usure cancels their subscription and when all of the subscriptions
  // have been removed
  return await Promise.all([
    removeModeratorsInCommunity(communityId),
    disablePaidFeatureFlags(communityId),
    archiveAllPrivateChannels(communityId, user.id),
  ])
    .then(() => getCommunityById(communityId))
    .catch(err => {
      console.error(err);
      return new UserError(`Error canceling subscription: ${err.message}`);
    });
};
