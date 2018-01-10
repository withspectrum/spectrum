// @flow
import type { GraphQLContext } from '../../';

export default (
  { channelId }: { channelId: string },
  _: any,
  { loaders }: GraphQLContext
) => loaders.channel.load(channelId);
