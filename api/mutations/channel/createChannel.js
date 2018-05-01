// @flow
import type { GraphQLContext } from '../../';
import type { CreateChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import { channelSlugIsBlacklisted } from '../../utils/permissions';
import { getCommunityById } from '../../models/community';
import { getChannelBySlug, createChannel } from '../../models/channel';
import { createOwnerInChannel } from '../../models/usersChannels';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';

export default requireAuth(
  async (_: any, args: CreateChannelInput, { user }: GraphQLContext) => {
    if (!await user.canModerateCommunity(args.input.communityId)) {
      return new UserError('You don’t have permission to manage this channel');
    }

    if (channelSlugIsBlacklisted(args.input.slug)) {
      return new UserError('This channel name is reserved.');
    }

    const community = await getCommunityById(args.input.communityId);
    const channelWithSlug = await getChannelBySlug(
      args.input.slug,
      community.slug
    );

    if (channelWithSlug) {
      return new UserError('A channel with this slug already exists.');
    }

    const newChannel = await createChannel(args, user.id);

    return await createOwnerInChannel(newChannel.id, user.id).then(
      () => newChannel
    );
  }
);
