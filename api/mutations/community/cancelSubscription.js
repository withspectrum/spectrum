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
import {
  isAuthedResolver as requireAuth,
  canAdministerCommunity,
} from '../../utils/permissions';

type Input = {
  input: {
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { communityId } = args.input;
  const { user, loaders } = ctx;

  const { customer, community } = await StripeUtil.jobPreflight(communityId);

  if (!await canAdministerCommunity(user.id, communityId, loaders)) {
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
    disablePaidFeatureFlags(communityId, user.id),
    archiveAllPrivateChannels(communityId, user.id),
  ])
    .then(() => getCommunityById(communityId))
    .catch(err => {
      console.error(err);
      return new UserError(`Error canceling subscription: ${err.message}`);
    });
});
