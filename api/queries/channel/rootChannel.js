// @flow
import type { GraphQLContext } from '../../';
import type { GetChannelArgs } from '../../models/channel';
import UserError from '../../utils/UserError';
import { getChannelBySlug } from '../../models/channel';
import { canViewChannel } from '../../utils/permissions';

export default async (_: any, args: GetChannelArgs, ctx: GraphQLContext) => {
  const { loaders, user: currentUser } = ctx;

  if (args.id) {
    if (!(await canViewChannel(currentUser, args.id, loaders))) return null;
    return await loaders.channel.load(args.id);
  }

  if (args.channelSlug && args.communitySlug) {
    const channel = await getChannelBySlug(
      args.channelSlug,
      args.communitySlug
    );
    if (!channel) return null;
    if (!(await canViewChannel(currentUser, channel.id, loaders))) return null;
    return channel;
  }
  return new UserError('We couldn’t find this channel');
};
