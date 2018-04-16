// @flow
const constants = require('./constants');
const defaultUsers = require('./users');
const defaultCommunities = require('./communities');
const defaultChannels = require('./channels');
const defaultThreads = require('./threads');
const defaultUsersThreads = require('./usersThreads');
const defaultDirectMessageThreads = require('./directMessageThreads');
const defaultUsersDirectMessageThreads = require('./usersDirectMessageThreads');
const defaultUsersCommunities = require('./usersCommunities');
const defaultUsersChannels = require('./usersChannels');
const defaultUsersSettings = require('./usersSettings')();
const defaultMessages = require('./messages');

module.exports = {
  constants,
  defaultUsers,
  defaultCommunities,
  defaultChannels,
  defaultThreads,
  defaultUsersThreads,
  defaultDirectMessageThreads,
  defaultUsersDirectMessageThreads,
  defaultUsersCommunities,
  defaultUsersChannels,
  defaultMessages,
  defaultUsersSettings,
  defaultNotifications: [],
  defaultCommunitySettings: [],
  defaultChannelSettings: [],
};
