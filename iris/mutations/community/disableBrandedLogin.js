// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  createCommunitySettings,
  disableCommunityBrandedLogin,
} from '../../models/communitySettings';

type DisableBrandedLoginInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id: communityId } }: DisableBrandedLoginInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be signed in to manage this community.');
  }

  const [permissions, settings] = await Promise.all([
    loaders.userPermissionsInCommunity.load([currentUser.id, communityId]),
    loaders.communitySettings.load(communityId),
  ]);

  if (!permissions.isOwner) {
    return new UserError("You don't have permission to do this.");
  }

  const hasSettings = settings && settings.reduction.length > 0;
  if (hasSettings) {
    return await disableCommunityBrandedLogin(communityId);
  } else {
    return await createCommunitySettings(communityId);
  }
};
