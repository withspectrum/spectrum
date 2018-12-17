// TODO: Flow type again
import Raven from 'shared/raven';
import type { DBChannel } from 'shared/types';
import type { GraphQLContext } from '../../';
import { canViewChannel } from '../../utils/permissions';
import cache from 'shared/cache/redis';
import { channelOnlineMemberCount } from 'shared/graphql-cache-keys';

export default async (root: DBChannel, _: any, ctx: GraphQLContext) => {
  const { user, loaders } = ctx;
  const { id, memberCount: rootMemberCount } = root;

  if (!(await canViewChannel(user, id, loaders))) {
    return {
      members: 0,
      onlineMembers: 0,
    };
  }

  const cachedOnlineMemberCount = await cache.get(channelOnlineMemberCount(id));

  const onlineMemberCount =
    (await typeof cachedOnlineMemberCount) === 'number' ||
    loaders.channelOnlineMemberCount
      .load(id)
      .then(res => (res && res.reduction) || 0);

  // Cache the fields for an hour
  (await typeof cachedOnlineMemberCount) === 'number' ||
    cache.set(channelOnlineMemberCount(id), onlineMemberCount, 'EX', 3600);

  if (typeof rootMemberCount === 'number') {
    return {
      members: rootMemberCount,
      onlineMembers: onlineMemberCount,
    };
  }

  // Fallback if there's no denormalized memberCount, also report to Sentry
  Raven.captureException(
    new Error(`Channel with ID "${id}" does not have denormalized memberCount.`)
  );
  return {
    members: await loaders.channelMemberCount
      .load(id)
      .then(res => (res && res.reduction) || 0),
    onlineMembers: onlineMemberCount,
  };
};
