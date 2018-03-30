// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  createCommunitySettings,
  enableCommunityBrandedLogin,
} from '../../models/communitySettings';

type EnableBrandedLoginInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id: communityId } }: EnableBrandedLoginInput,
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

  loaders.communitySettings.clear(communityId);

  // settings.id tells us that a channelSettings record exists in the db
  if (settings.id) {
    return await enableCommunityBrandedLogin(communityId);
  } else {
    return await createCommunitySettings(communityId).then(
      async () => await enableCommunityBrandedLogin(communityId)
    );
  }
};
