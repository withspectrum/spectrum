// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getCommunityById } from '../../models/community';
import {
  removePendingMemberInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  input: {
    communityId: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { communityId } = args.input;

  const [permissions, community] = await Promise.all([
    checkUserPermissionsInCommunity(communityId, user.id),
    getCommunityById(communityId),
  ]);

  // if no permissions exist, the user wasn't pending to begin with
  if (!permissions || permissions.length === 0) {
    return community;
  }

  if (!community) {
    return new UserError("We couldn't find that community.");
  }

  return await removePendingMemberInCommunity(communityId, user.id).then(
    () => community
  );
});
