// @flow
const seed = require('../../api/migrations/seed/default/index');

const {
  defaultUsers,
  defaultUsersSettings,
  defaultCommunities,
  defaultCommunitySettings,
  defaultChannels,
  defaultChannelSettings,
  defaultThreads,
  defaultNotifications,
  defaultUsersNotifications,
  defaultDirectMessageThreads,
  defaultUsersDirectMessageThreads,
  defaultUsersCommunities,
  defaultUsersChannels,
  defaultMessages,
  defaultUsersThreads,
  defaultReactions,
} = seed;

const data = {
  users: defaultUsers,
  usersSettings: defaultUsersSettings,
  communities: defaultCommunities,
  communitySettings: defaultCommunitySettings,
  channels: defaultChannels,
  channelSettings: defaultChannelSettings,
  threads: defaultThreads,
  usersThreads: defaultUsersThreads,
  notifications: defaultNotifications,
  directMessageThreads: defaultDirectMessageThreads,
  usersDirectMessageThreads: defaultUsersDirectMessageThreads,
  usersCommunities: defaultUsersCommunities,
  usersChannels: defaultUsersChannels,
  messages: defaultMessages,
  reactions: defaultReactions,
  usersNotifications: defaultUsersNotifications,
};

module.exports = data;
