// @flow
const ChannelSlackSettings = /* GraphQL */ `
  enum BotConnectionEventType {
    threadCreated
  }
  
  type BotConnection {
    threadCreated: String
  }

	type ChannelSlackSettings {
		botConnection: BotConnection
	}

  input UpdateChannelSlackBotConnectionInput {
    channelId: String
    slackChannelId: String
    eventType: BotConnectionEventType
  }

  extend type Mutation {
		updateChannelSlackBotConnection(input: UpdateChannelSlackBotConnectionInput): Channel @isAuthed
	}
`;

module.exports = ChannelSlackSettings;
