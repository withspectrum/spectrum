// @flow
import type { GraphQLContext } from '../../';
import type { DBChannel } from 'shared/types';

export default async (
  { id, memberCount }: DBChannel,
  _: any,
  { loaders }: GraphQLContext
) => {
  const [threads] = await Promise.all([loaders.channelThreadCount.load(id)]);

  return {
    threads: threads ? threads.reduction : 0,
    members: memberCount || 1,
  };
};
