const constants = require('./constants');
const { PRIVATE_COMMUNITY_ID } = constants;

module.exports = [
  {
    id: 1,
    communityId: PRIVATE_COMMUNITY_ID,
    brandedLogin: {
      isEnabled: false,
      message: null,
    },
    slackSettings: {
      connectedAt: null,
      connectedBy: null,
      teamName: null,
      teamId: null,
      scope: null,
      token: null,
      invitesSentAt: null,
      invitesMemberCount: null,
      invitesCustomMessage: null,
    },
    joinSettings: {
      tokenJoinEnabled: true,
      token: 'abc',
    },
  },
];
