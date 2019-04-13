// @flow
import isConnected from './isConnected';
import teamName from './teamName';
import hasSentInvites from './hasSentInvites';
import slackChannelList from './slackChannelList';
import memberCount from './memberCount';
import invitesSentAt from './invitesSentAt';

module.exports = {
  CommunitySlackSettings: {
    teamName,
    isConnected,
    hasSentInvites,
    slackChannelList,
    memberCount,
    invitesSentAt,
  },
};
