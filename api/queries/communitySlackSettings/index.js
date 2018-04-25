// @flow
import isConnected from './isConnected';
import teamName from './teamName';
import hasSentInvites from './hasSentInvites';
import slackChannelList from './slackChannelList';

module.exports = {
  CommunitySlackSettings: {
    teamName,
    isConnected,
    hasSentInvites,
    slackChannelList,
  },
};
