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
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

export default requireAuth(
  async (
    _: any,
    args: CreateChannelInput,
    { user, loaders }: GraphQLContext
  ) => {
    // TODO: Figure out how to not have to do this - somehow combine forces with canModerateChannel function which is fetching most of the same data anyways
    const community = await loaders.community.load(args.input.communityId);

    if (!await canModerateCommunity(user.id, args.input.communityId, loaders)) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_CREATED_FAILED,
        context: { communityId: community.id },
        properties: {
          reason: 'no permission',
        },
      });
      return new UserError(
        'You don’t have permission to create channels in this community'
      );
    }

    if (channelSlugIsBlacklisted(args.input.slug)) {
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_CREATED_FAILED,
        context: { communityId: community.id },
        properties: {
          reason: 'slug blacklisted',
        },
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
      trackQueue.add({
        userId: user.id,
        event: events.CHANNEL_CREATED_FAILED,
        context: { communityId: community.id },
        properties: {
          reason: 'slug taken',
        },
      });
      return new UserError(
        'A channel with this url already exists in this community - please try another name'
      );
    }

    const newChannel = await createChannel(args, user.id);

    trackQueue.add({
      userId: user.id,
      event: events.CHANNEL_CREATED,
      context: { channelId: newChannel.id },
    });

    return await createOwnerInChannel(newChannel.id, user.id).then(
      () => newChannel
    );
  }
);
