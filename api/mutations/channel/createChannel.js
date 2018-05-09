// @flow
import type { GraphQLContext } from '../../';
import type { CreateChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import { channelSlugIsBlacklisted } from '../../utils/permissions';
import { getChannelBySlug, createChannel } from '../../models/channel';
import { createOwnerInChannel } from '../../models/usersChannels';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';
import { events, transformations } from 'shared/analytics';
import { getEntityDataForAnalytics } from '../../utils/analytics';

export default requireAuth(
  async (
    _: any,
    args: CreateChannelInput,
    { user, loaders, track }: GraphQLContext
  ) => {
    // TODO: Figure out how to not have to do this - somehow combine forces with canModerateChannel function which is fetching most of the same data anyways
    const community = await loaders.community.load(args.input.communityId);

    const defaultTrackingData = await getEntityDataForAnalytics(loaders)({
      communityId: args.input.communityId,
      userId: user.id,
    });

    if (!await canModerateCommunity(user.id, args.input.communityId, loaders)) {
      track(events.CHANNEL_CREATED_FAILED, {
        ...defaultTrackingData,
        reason: 'no permission',
      });
      return new UserError(
        'You don’t have permission to create channels in this community'
      );
    }

    if (channelSlugIsBlacklisted(args.input.slug)) {
      track(events.CHANNEL_CREATED_FAILED, {
        ...defaultTrackingData,
        reason: 'slug blacklisted',
      });
      return new UserError(
        'This channel url is reserved - please try another name'
      );
    }

    const channelWithSlug = await getChannelBySlug(
      args.input.slug,
      community.slug
    );

    if (channelWithSlug) {
      track(events.CHANNEL_CREATED_FAILED, {
        ...defaultTrackingData,
        reason: 'slug taken',
      });
      return new UserError(
        'A channel with this url already exists in this community - please try another name'
      );
    }

    const newChannel = await createChannel(args, user.id);

    track(events.CHANNEL_CREATED, {
      ...defaultTrackingData,
      channel: transformations.analyticsChannel(newChannel),
    });

    return await createOwnerInChannel(newChannel.id, user.id).then(
      () => newChannel
    );
  }
);
