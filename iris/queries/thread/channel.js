// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default ({ channelId }: DBThread, _: any, { loaders }: GraphQLContext) =>
  loaders.channel.load(channelId);
