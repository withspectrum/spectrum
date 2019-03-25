// @flow
const ChannelSlackSettings = /* GraphQL */ `
  enum BotLinksEventType {
    threadCreated
  }

  type BotLinks {
    threadCreated: String
  }

  type ChannelSlackSettings @cacheControl(scope: PRIVATE) {
    botLinks: BotLinks
  }

  input UpdateChannelSlackBotLinksInput {
    channelId: String
    slackChannelId: String
    eventType: BotLinksEventType
  }

  extend type Mutation {
    updateChannelSlackBotLinks(input: UpdateChannelSlackBotLinksInput): Channel
  }
`;

module.exports = ChannelSlackSettings;
