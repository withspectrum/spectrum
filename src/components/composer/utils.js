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

export const sortChannels = (channels: GetChannelType[]): GetChannelType[] => {
  return channels.filter(hasChannelPermissions).filter(channel => {
    if (!channel.isPrivate && !channel.isArchived) return true;
    return true;
  });
};

export const getDefaultActiveChannel = (
  channels: Array<GetChannelType>,
  activeChannelId: ?string
): ?GetChannelType => {
  // If there's an active channel, use that
  const activeChannel = channels.find(
    channel => channel.id === activeChannelId
  );
  if (activeChannel) return activeChannel;

  // Otherwise, try to use the "General" channel
  const generalChannel = channels.find(channel => channel.slug === 'general');
  if (generalChannel) return generalChannel;

  // Otherwise, try to use any default channel
  // $FlowIssue
  const defaultChannel = channels.find(channel => channel.isDefault);
  if (defaultChannel) return defaultChannel;

  // Otherwise, just take the first one and get on with it
  return channels[0];
};
