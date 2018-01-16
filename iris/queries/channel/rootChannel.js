// @flow
import type { GraphQLContext } from '../../';
import type { GetChannelArgs } from '../../models/channel';
import { getChannelBySlug } from '../../models/channel';

export default (_: any, args: GetChannelArgs, { loaders }: GraphQLContext) => {
  if (args.id) return loaders.channel.load(args.id);
  if (args.channelSlug && args.communitySlug)
    return getChannelBySlug(args.channelSlug, args.communitySlug);
  return null;
};
