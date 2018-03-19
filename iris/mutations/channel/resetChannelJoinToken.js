// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  createChannelSettings,
  enableChannelTokenJoin,
  resetChannelJoinToken,
} from '../../models/channelSettings';

type ResetJoinTokenInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id: channelId } }: ResetJoinTokenInput,
  { user, loaders }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be signed in to manage this channel.');
  }

  const [permissions, settings] = await Promise.all([
    loaders.userPermissionsInChannel.load([currentUser.id, channelId]),
    loaders.channelSettings.load(channelId),
  ]);

  if (!permissions.isOwner) {
    return new UserError("You don't have permission to do this.");
  }

  loaders.channelSettings.clear(channelId);

  const hasSettings = settings && settings.reduction.length > 0;
  if (hasSettings) {
    return await resetChannelJoinToken(channelId);
  } else {
    return await createChannelSettings(channelId).then(
      async () => await enableChannelTokenJoin(channelId)
    );
  }
};
