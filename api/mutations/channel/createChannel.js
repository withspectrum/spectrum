// @flow
import type { GraphQLContext } from '../../';
import type { CreateChannelInput } from '../../models/channel';
import UserError from '../../utils/UserError';
import { channelSlugIsDenyListed } from '../../utils/permissions';
import { getChannelBySlug, createChannel } from '../../models/channel';
import { createOwnerInChannel } from '../../models/usersChannels';
import {
  isAuthedResolver as requireAuth,
  canModerateCommunity,
} from '../../utils/permissions';

export default requireAuth(
  async (_: any, args: CreateChannelInput, ctx: GraphQLContext) => {
    const { user, loaders } = ctx;

    // TODO: Figure out how to not have to do this - somehow combine forces with canModerateChannel function which is fetching most of the same data anyways
    const community = await loaders.community.load(args.input.communityId);

    if (
      !(await canModerateCommunity(user.id, args.input.communityId, loaders))
    ) {
      return new UserError(
        'You don’t have permission to create channels in this community'
      );
    }

    if (channelSlugIsDenyListed(args.input.slug)) {
      return new UserError(
        'This channel url is reserved - please try another name'
      );
    }

    const channelWithSlug = await getChannelBySlug(
      args.input.slug,
      community.slug
    );

    if (channelWithSlug) {
      return new UserError(
        'A channel with this url already exists in this community - please try another name'
      );
    }

    const newChannel = await createChannel(args, user.id);

    return await createOwnerInChannel(newChannel.id, user.id).then(
      () => newChannel
    );
  }
);
