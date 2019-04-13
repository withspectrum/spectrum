// @flow
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';

const hasCommunityPermissions = (community: ?CommunityInfoType) =>
  community &&
  (community.communityPermissions.isMember ||
    community.communityPermissions.isOwner);

const hasChannelPermissions = (channel: ?ChannelInfoType) =>
  channel &&
  (channel.channelPermissions.isMember || channel.channelPermissions.isOwner);

const sortByRep = (a, b) => {
  if (!a || !b) return 0;
  const bc = parseInt(b.communityPermissions.reputation, 10);
  const ac = parseInt(a.communityPermissions.reputation, 10);
  return bc <= ac ? -1 : 1;
};

export const sortCommunities = (
  communities: Array<?CommunityInfoType>
): Array<?CommunityInfoType> => {
  if (!communities || communities.length === 0) return [];

  return communities.filter(hasCommunityPermissions).sort(sortByRep);
};

const organizeChannels = (
  channels: Array<?ChannelInfoType>
): Array<?ChannelInfoType> => {
  if (!channels || channels.length === 0) return [];

  const general = channels.find(
    channel => channel && channel.slug === 'general'
  );
  const withoutGeneral = channels
    .filter(channel => channel && channel.slug !== 'general')
    // sort the remaining channels alphabetically
    .sort((a, b) => {
      if (!a || !b) return 0;
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
  if (!general) return [...withoutGeneral];
  return [general, ...withoutGeneral];
};

export const sortChannels = (
  channels: Array<?ChannelInfoType>
): Array<?ChannelInfoType> => {
  if (!channels || channels.length === 0) return [];

  const filtered = channels.filter(hasChannelPermissions).filter(channel => {
    return channel && !channel.isArchived;
  });

  return organizeChannels(filtered);
};
