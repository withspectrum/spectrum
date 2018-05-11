// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { updateCommunityPaidFeature } from '../../models/community';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';

type Input = {
  input: {
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { communityId } = args.input;
  const { user, loaders } = ctx;

  if (!communityId) {
    return new UserError('No communityId found');
  }

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    return new UserError("You don't have permission to do this.");
  }

  return await updateCommunityPaidFeature(
    communityId,
    'analyticsEnabled',
    false,
    user.id
  ).catch(err => {
    return new UserError('We had trouble saving your card', err.message);
  });
});
