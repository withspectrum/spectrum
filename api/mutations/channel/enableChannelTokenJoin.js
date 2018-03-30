// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import {
  createChannelSettings,
  enableChannelTokenJoin,
} from '../../models/channelSettings';

type EnableTokenJoinInput = {
  input: {
    id: string,
  },
};

export default async (
  _: any,
  { input: { id: channelId } }: EnableTokenJoinInput,
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

  // settings.id tells us that a channelSettings record exists in the db
  if (settings.id) {
    return await enableChannelTokenJoin(channelId);
  } else {
    return await createChannelSettings(channelId).then(() =>
      enableChannelTokenJoin(channelId)
    );
  }
};
