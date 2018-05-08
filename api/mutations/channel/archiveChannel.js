// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { archiveChannel } from '../../models/channel';
import {
  isAuthedResolver as requireAuth,
  canModerateChannel,
} from '../../utils/permissions';
import {
  track,
  trackUserError,
  events,
  transformations,
} from 'shared/analytics';
import { errors } from 'shared/errors';

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
        errors.CHANNEL_ARCHIVED_FAILED_NO_PERMISSIONS,
        eventProperties
      );
      return new UserError(errors.CHANNEL_ARCHIVED_FAILED_NO_PERMISSIONS);
    }

    if (channelToEvaluate.archivedAt) {
      trackUserError(
        user.id,
        errors.CHANNEL_ARCHIVED_FAILED_ALREADY_ARCHIVED,
        eventProperties
      );
      return new UserError(errors.CHANNEL_ARCHIVED_FAILED_ALREADY_ARCHIVED);
    }

    if (channelToEvaluate.slug === 'general') {
      trackUserError(
        user.id,
        errors.CHANNEL_ARCHIVED_FAILED_GENERAL,
        eventProperties
      );
      return new UserError(errors.CHANNEL_ARCHIVED_FAILED_GENERAL);
    }

    const archivedChannel = await archiveChannel(channelId);

    track(user.id, events.CHANNEL_ARCHIVED, eventProperties);

    return archivedChannel;
  }
);
