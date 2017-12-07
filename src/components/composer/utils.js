// @flow

// TODO(@mxstbr): Transform GraphQL type
type Community = Object;

const hasCommunityPermissions = ({ communityPermissions }) =>
  communityPermissions.isMember || communityPermissions.isOwner;

const hasChannelPermissions = ({ channelPermissions }) =>
  channelPermissions.isMember || channelPermissions.isOwner;

const sortByRep = (a, b) => {
  const bc = parseInt(b.communityPermissions.reputation, 10);
  const ac = parseInt(a.communityPermissions.reputation, 10);
  return bc <= ac ? -1 : 1;
};

export const sortCommunities = (communities: Community[]): Community[] => {
  return communities.filter(hasCommunityPermissions).sort(sortByRep);
};

// TODO(@mxstbr): Transform GraphQL type
type Channel = Object;

export const sortChannels = (channels: Channel[]): Channel[] => {
  return channels.filter(hasChannelPermissions).filter(channel => {
    if (!channel.isPrivate) return true;
    // If it's a private channel, but the community has downgraded don't give
    // users the option to post there
    if (!channel.community.isPro) return false;
    return true;
  });
};

export const getDefaultActiveChannel = (
  channels: Array<Channel>,
  activeChannelId: ?string
): ?Channel => {
  // If there's an active channel, use that
  const activeChannel = channels.find(
    channel => channel.id === activeChannelId
  );
  if (activeChannel) return activeChannel;

  // Otherwise, try to use the "General" channel
  const generalChannel = channels.find(
    channel => channel.slug === 'general' && channel.isDefault
  );
  if (generalChannel) return generalChannel;

  // Otherwise, try to use any default channel
  const defaultChannel = channels.find(channel => channel.isDefault);
  if (defaultChannel) return defaultChannel;

  // Otherwise, just take the first one and get on with it
  return channels[0];
};
