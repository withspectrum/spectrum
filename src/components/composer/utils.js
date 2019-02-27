// @flow
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel.js';

const hasCommunityPermissions = ({ communityPermissions }) =>
  communityPermissions.isMember || communityPermissions.isOwner;

const hasChannelPermissions = ({ channelPermissions }) =>
  channelPermissions.isMember || channelPermissions.isOwner;

const sortByRep = (a, b) => {
  const bc = parseInt(b.communityPermissions.reputation, 10);
  const ac = parseInt(a.communityPermissions.reputation, 10);
  return bc <= ac ? -1 : 1;
};

export const sortCommunities = (
  communities: Array<GetCommunityType>
): GetCommunityType[] => {
  return communities.filter(hasCommunityPermissions).sort(sortByRep);
};

const organizeChannels = (channels: GetChanneltype[]): GetChannelType[] => {
  const general = channels.find(channel => channel.slug === 'general');
  const withoutGeneral = channels
    .filter(channel => channel.slug !== 'general')
    // sort the remaining channels alphabetically
    .sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });

  return [general, ...withoutGeneral];
};

export const sortChannels = (channels: GetChannelType[]): GetChannelType[] => {
  const filtered = channels.filter(hasChannelPermissions).filter(channel => {
    if (!channel.isPrivate && !channel.isArchived) return true;
    return true;
  });

  return organizeChannels(filtered);
};
