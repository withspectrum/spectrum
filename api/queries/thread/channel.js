// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';

export default async (root: DBThread, _: any, ctx: GraphQLContext) => {
  const { channelId, id } = root;
  const { loaders } = ctx;
  const channel = await loaders.channel.load(channelId);
  if (!channel) {
    console.error(
      'User queried thread of non-existent/deleted channel: ',
      channelId
    );
    console.error('Thread queried: ', id);
  }
  return channel;
};
