// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { canViewCommunity } from '../../utils/permissions';
import cache from 'shared/cache/redis';

export default async (root: DBCommunity, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { id } = root;

  if (!(await canViewCommunity(user, id, loaders))) {
    return {
      channels: 0,
      members: 0,
      onlineMembers: 0,
    };
  }

  const [
    cachedChannelCount,
    cachedMemberCount,
    cachedOnlineMemberCount,
  ] = await Promise.all([
    cache.get(`community:${id}:channelCount`),
    cache.get(`community:${id}:memberCount`),
    cache.get(`community:${id}:onlineMemberCount`),
  ]);

  const [channelCount, memberCount, onlineMemberCount] = await Promise.all([
    cachedChannelCount ||
      loaders.communityChannelCount
        .load(id)
        .then(res => (res && res.reduction) || 0),
    cachedMemberCount ||
      loaders.communityMemberCount
        .load(id)
        .then(res => (res && res.reduction) || 0),
    cachedOnlineMemberCount ||
      loaders.communityOnlineMemberCount
        .load(id)
        .then(res => (res && res.reduction) || 0),
  ]);

  // Cache the fields for an hour
  await Promise.all([
    cache.set(`community:${id}:channelCount`, channelCount, 'ex', 3600),
    cache.set(`community:${id}:memberCount`, memberCount, 'ex', 3600),
    cache.set(
      `community:${id}:onlineMemberCount`,
      onlineMemberCount,
      'ex',
      3600
    ),
  ]);

  return {
    channels: channelCount,
    members: memberCount,
    onlineMembers: onlineMemberCount,
  };
};
