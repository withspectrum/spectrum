// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  getOrCreateCommunitySettings,
  enableCommunityTokenJoin,
} from '../../models/communitySettings';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';

type Input = {
  input: {
    id: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { id: communityId } = args.input;
  const { user, loaders } = ctx;

  if (!(await canModerateCommunity(user.id, communityId, loaders))) {
    return new UserError('You don’t have permission to manage this Community');
  }

  return await getOrCreateCommunitySettings(communityId).then(
    async () => await enableCommunityTokenJoin(communityId)
  );
});
