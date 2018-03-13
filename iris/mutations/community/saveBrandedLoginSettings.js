// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  createCommunitySettings,
  updateCommunityBrandedLoginMessage,
} from '../../models/communitySettings';

type EnableBrandedLoginInput = {
  input: {
    id: string,
    message: string,
  },
};

export default async (
  _: any,
  { input: { id: communityId, message } }: EnableBrandedLoginInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be signed in to manage this community.');
  }

  if (message && message.length > 280) {
    return new UserError(
      'Custom login messages should be less than 280 characters'
    );
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
    return await updateCommunityBrandedLoginMessage(communityId, message);
  } else {
    return await createCommunitySettings(communityId).then(
      async () => await updateCommunityBrandedLoginMessage(communityId, message)
    );
  }
};
