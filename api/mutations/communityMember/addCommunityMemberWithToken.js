// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { createMemberInDefaultChannels } from '../../models/usersChannels';
import {
  getUserPermissionsInCommunity,
  createMemberInCommunity,
  approvePendingMemberInCommunity,
} from '../../models/usersCommunities';
import { getCommunityBySlug } from '../../models/community';
import { getOrCreateCommunitySettings } from '../../models/communitySettings';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

type Input = {
  input: {
    communitySlug: string,
    communitySlug: string,
    token: string,
  },
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { user } = ctx;
  const { communitySlug, token } = args.input;

  const community = await getCommunityBySlug(communitySlug);

  if (!community) {
    return new UserError('No community found in this community');
  }

  if (!community.isPrivate) {
    return community;
  }

  const [communityPermissions, settings] = await Promise.all([
    getUserPermissionsInCommunity(community.id, user.id),
    getOrCreateCommunitySettings(community.id),
  ]);

  if (
    communityPermissions.isOwner ||
    communityPermissions.isModerator ||
    communityPermissions.isMember
  ) {
    return community;
  }

  if (communityPermissions.isBlocked) {
    return new UserError("You don't have permission to view this community");
  }

  if (!settings.joinSettings || !settings.joinSettings.tokenJoinEnabled) {
    return new UserError(
      "You can't join at this time, the token may have changed"
    );
  }
  if (
    settings.joinSettings.tokenJoinEnabled &&
    token !== settings.joinSettings.token
  ) {
    return new UserError(
      "You can't join at this time, the token may have changed"
    );
  }

  if (communityPermissions.isPending) {
    return await Promise.all([
      approvePendingMemberInCommunity(community.id, user.id),
      createMemberInDefaultChannels(community.id, user.id),
    ]).then(() => community);
  }

  return await Promise.all([
    createMemberInCommunity(community.id, user.id),
    createMemberInDefaultChannels(community.id, user.id),
  ]).then(() => community);
});
