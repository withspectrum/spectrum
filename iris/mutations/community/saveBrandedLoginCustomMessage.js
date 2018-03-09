// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  createCommunitySettings,
  updateCommunityBrandedLoginCustomMessage,
} from '../../models/communitySettings';

type EnableBrandedLoginInput = {
  input: {
    id: string,
    value: string,
  },
};

export default async (
  _: any,
  { input: { id: communityId, value } }: EnableBrandedLoginInput,
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
    return await updateCommunityBrandedLoginCustomMessage(communityId, value);
  } else {
    return await createCommunitySettings(communityId).then(
      async () =>
        await updateCommunityBrandedLoginCustomMessage(communityId, value)
    );
  }
};
