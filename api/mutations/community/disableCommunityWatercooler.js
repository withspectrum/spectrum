// @flow
import UserError from '../../utils/UserError';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { setCommunityWatercoolerId } from '../../models/community';
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

type Args = {
  input: {
    id: string,
  },
};

export default requireAuth(async (_: any, args: Args, ctx: GraphQLContext) => {
  const { id: communityId } = args.input;
  const { user, loaders } = ctx;

  if (!(await canModerateCommunity(user.id, communityId, loaders))) {
    return new UserError("You don't have permission to do this.");
  }

  const community: DBCommunity = await loaders.community.load(communityId);

  if (!community.watercoolerId) return community;

  return setCommunityWatercoolerId(community.id, null);
});
