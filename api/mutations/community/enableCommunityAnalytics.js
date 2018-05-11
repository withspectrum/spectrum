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

  if (!await canModerateCommunity(user.id, communityId, loaders)) {
    return new UserError(
      'You must own or moderate this community to enable analytics'
    );
  }

  return await updateCommunityPaidFeature(
    communityId,
    'analyticsEnabled',
    true,
    user.id
  ).catch(err => {
    return new UserError('We had trouble saving your card', err.message);
  });
});
