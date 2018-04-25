// @flow
import type { DBChannel } from 'shared/types';
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';

export default async (
  { id }: DBChannel,
  _: any,
  { loaders, user }: GraphQLContext
) => {
  const currentUser = user;
  if (!currentUser) {
    return new UserError('You must be logged in to manage channel settings.');
  }

  // only community owners should be able to query for their slack team
  const [communityPermissions, channelPermissions] = await Promise.all([
    loaders.userPermissionsInCommunity.load([currentUser.id, id]),
    loaders.userPermissionsInChannel.load([currentUser.id, id]),
  ]);

  if (!communityPermissions) {
    return null;
  }

  if (
    !communityPermissions.isOwner ||
    !communityPermissions.isModerator ||
    !channelPermissions.isOwner ||
    !channelPermissions.isModerator
  ) {
    return new UserError(
      'You must own or moderate this channel to make changes to view Slack settings'
    );
  }

  return await loaders.channelSettings.load(id).then(settings => {
    const { slackSettings } = settings;

    return {
      botConnection: slackSettings ? slackSettings.botConnection : null,
    };
  });
};
