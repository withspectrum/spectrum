// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';
import { canViewCommunity } from '../../utils/permissions';
import * as cache from '../../cache';

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

  const getChannelCount = loaders.communityChannelCount;
  const getMemberCount = loaders.communityMemberCount;
  const getOnlineCount = loaders.communityOnlineMemberCount;

  const cacheCount = async (fn, field): Promise<number> => {
    const count = await fn.load(id);
    const key = `communityId:${id}:${field}`;
    const expiration = 3600; // one hour
    const value = count ? `${count.reduction}` : '0';

    return await cache
      .set({
        key,
        value,
        expiration,
      })
      .then(() => value);
  };

  const [
    cachedChannelCount,
    cachedMemberCount,
    cachedOnlineCount,
  ] = await Promise.all([
    cache.get(`communityId:${id}:channelCount`),
    cache.get(`communityId:${id}:memberCount`),
    cache.get(`communityId:${id}:onlineCount`),
  ]);

  const channelCount =
    cachedChannelCount || (await cacheCount(getChannelCount, 'channelCount'));
  const memberCount =
    cachedMemberCount || (await cacheCount(getMemberCount, 'memberCount'));
  const onlineCount =
    cachedOnlineCount || (await cacheCount(getOnlineCount, 'onlineCount'));

  return {
    channels: parseInt(channelCount) || 0,
    members: parseInt(memberCount) || 0,
    onlineMembers: parseInt(onlineCount) || 0,
  };
};
