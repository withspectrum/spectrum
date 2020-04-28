// @flow
import type { GraphQLContext } from '../..';
import UserError from '../../utils/UserError';
import {
  toggleCommunityNoindex,
  getCommunityById,
} from '../../models/community';
import {
  isAuthedResolver as requireAuth,
  canAdministerCommunity,
} from '../../utils/permissions';

type Input = {
  communityId: string,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { communityId } = args;
  const { user, loaders } = ctx;

  if (!(await canAdministerCommunity(user.id, communityId, loaders))) {
    return new UserError("You don't have permission to do this.");
  }

  const community = await getCommunityById(communityId);

  if (!community) {
    return new UserError('This community does not exist.');
  }

  return toggleCommunityNoindex(communityId);
});
