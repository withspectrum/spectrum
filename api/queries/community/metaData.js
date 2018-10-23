// TODO: Flow type again
import Raven from 'shared/raven';
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { canViewCommunity } from '../../utils/permissions';
import cache from 'shared/cache/redis';

export default async (root: DBCommunity, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { id, memberCount: rootMemberCount } = root;

  if (!(await canViewCommunity(user, id, loaders))) {
    return {
      channels: 0,
      members: 0,
      onlineMembers: 0,
    };
  }

  const [cachedChannelCount, cachedOnlineMemberCount] = await Promise.all([
    cache.get(`community:${id}:channelCount`),
    cache.get(`community:${id}:onlineMemberCount`),
  ]);

  const [channelCount, onlineMemberCount] = await Promise.all([
    typeof cachedChannelCount === 'number' ||
      loaders.communityChannelCount
        .load(id)
        .then(res => (res && res.reduction) || 0),
    typeof cachedOnlineMemberCount === 'number' ||
      loaders.communityOnlineMemberCount
        .load(id)
        .then(res => (res && res.reduction) || 0),
  ]);

  // Cache the fields for an hour
  await Promise.all([
    typeof cachedChannelCount === 'number' ||
      cache.set(`community:${id}:channelCount`, channelCount, 'ex', 3600),
    typeof cachedOnlineMemberCount === 'number' ||
      cache.set(
        `community:${id}:onlineMemberCount`,
        onlineMemberCount,
        'ex',
        3600
      ),
  ]);

  if (typeof rootMemberCount === 'number') {
    return {
      channels: channelCount,
      members: rootMemberCount,
      onlineMembers: onlineMemberCount,
    };
  }

  // Fallback if there's no denormalized memberCount, also report to Sentry
  Raven.captureException(
    new Error(
      `Community with ID "${id}" does not have denormalized memberCount.`
    )
  );
  return {
    members: await loaders.communityMemberCount
      .load(id)
      .then(res => (res && res.reduction) || 0),
    onlineMembers: onlineMemberCount,
    channels: channelCount,
  };
};
