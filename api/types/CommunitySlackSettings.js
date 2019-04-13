// @flow
const CommunitySlackSettings = /* GraphQL */ `
  type SlackChannel {
    id: String
    name: String
  }

  type CommunitySlackSettings {
    isConnected: Boolean
    hasSentInvites: Boolean
    teamName: String
    memberCount: Int
    invitesSentAt: Date
    slackChannelList: [SlackChannel]
  }
`;

module.exports = CommunitySlackSettings;
