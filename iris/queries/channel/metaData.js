// @flow
import type { GraphQLContext } from '../../';

export default (
  { id }: { id: string },
  _: any,
  { loaders }: GraphQLContext
) => {
  return Promise.all([
    loaders.channelThreadCount.load(id),
    loaders.channelMemberCount.load(id),
  ]).then(([threadCount, memberCount]) => ({
    threads: threadCount ? threadCount.reduction : 0,
    members: memberCount ? memberCount.reduction : 0,
  }));
};
