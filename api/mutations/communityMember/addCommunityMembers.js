// @flow
import type { GraphQLContext } from '../../';
import type { DBCommunity } from 'shared/types';
import { getCommunityById } from '../../models/community';
import {
  createMemberInCommunity,
  checkUserPermissionsInCommunity,
} from '../../models/usersCommunities';
import { createMemberInDefaultChannels } from '../../models/usersChannels';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import UserError from '../../utils/UserError';

type Input = {
  input: {
    communityIds: Array<string>,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { communityIds } = args.input;

  if (communityIds.length > 20) {
    return new UserError('Try joining just a few communities at a time');
  }

  const canJoinCommunity = async (
    communityId: string
  ): Promise<?DBCommunity> => {
    const [permissions, community] = await Promise.all([
      checkUserPermissionsInCommunity(communityId, user.id),
      getCommunityById(communityId),
    ]);

    if (!community) {
      return null;
    }

    // if no permissions exist, join them to the community!
    if (!permissions || permissions.length === 0) {
      return community;
    }

    const permission = permissions[0];

    if (!permission.isMember) {
      return community;
    }

    return null;
  };

  const handleJoin = async (communityId: string) => {
    return await Promise.all([
      createMemberInCommunity(communityId, user.id),
      createMemberInDefaultChannels(communityId, user.id),
    ]);
  };

  return communityIds.map(async id => {
    const community = await canJoinCommunity(id);
    if (!community) return null;
    return await handleJoin(id).then(() => community);
  });
});
