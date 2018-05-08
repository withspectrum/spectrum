// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { getChannelById, restoreChannel } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import { errors } from 'shared/errors';
import {
  track,
  trackUserError,
  events,
  transformations,
} from 'shared/analytics';

export default requireAuth(
  async (
    _: any,
    { input: { channelId } }: { input: { channelId: string } },
    { user, loaders }: GraphQLContext
  ) => {
    // TODO: Figure out how to not have to do this - somehow combine forces with canModerateChannel function
    // which is fetching most of the same data anyways
    const channelToEvaluate = await loaders.channel.load(channelId);
    const communityToEvaluate = await loaders.community.load(
      channelToEvaluate.communityId
    );
    const [communityPermissions, channelPermissions] = await Promise.all([
      loaders.userPermissionsInCommunity.load([
        user.id,
        communityToEvaluate.id,
      ]),
      loaders.userPermissionsInChannel.load([user.id, channelId]),
    ]);

    const eventProperties = {
      channel: {
        ...transformations.analyticsChannel(channelToEvaluate),
        ...transformations.analyticsChannelPermissions(channelPermissions),
      },
      community: {
        ...transformations.analyticsCommunity(communityToEvaluate),
        ...transformations.analyticsCommunityPermissions(communityPermissions),
      },
    };

    if (!await canModerateChannel(user.id, channelId, loaders)) {
      trackUserError(
        user.id,
        errors.CHANNEL_RESTORED_FAILED_NO_PERMISSIONS,
        eventProperties
      );
      return new UserError('You don’t have permission to manage this channel');
    }

    const channel = await getChannelById(channelId);

    if (!channel.archivedAt) {
      return new UserError('Channel already restored');
    }

    const restoredChannel = await restoreChannel(channelId);

    track(user.id, events.CHANNEL_RESTORED, eventProperties);

    return restoredChannel;
  }
);
