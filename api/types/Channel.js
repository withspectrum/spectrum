// @flow
const Channel = /* GraphQL */ `
	type ChannelMembersConnection {
		pageInfo: PageInfo!
		edges: [ChannelMemberEdge!]
	}

	type ChannelMemberEdge {
		cursor: String!
		node: User!
	}

	type ChannelThreadsConnection {
		pageInfo: PageInfo!
		edges: [ChannelThreadEdge!]
	}

	type ChannelThreadEdge {
		cursor: String!
		node: Thread!
	}

	type ChannelMetaData {
		threads: Int
		members: Int
	}

	input CreateChannelInput {
		name: String!
		slug: LowercaseString!
		description: String
		communityId: ID!
		isPrivate: Boolean
		isDefault: Boolean
	}

	input EditChannelInput {
		name: String
		slug: LowercaseString
		description: String
		isPrivate: Boolean
		channelId: ID!
	}

	enum PendingActionType {
		block
		approve
	}

	input TogglePendingUserInput {
		channelId: ID!
		userId: ID!
		action: PendingActionType!
	}

	input UnblockUserInput {
		channelId: ID!
		userId: ID!
	}

	type JoinSettings {
		tokenJoinEnabled: Boolean
		token: String
	}

	type Channel {
		id: ID!
		createdAt: Date!
		modifiedAt: Date
		name: String!
		description: String!
		slug: LowercaseString!
		isPrivate: Boolean
		isDefault: Boolean
		isArchived: Boolean
    channelPermissions: ChannelPermissions! @cost(complexity: 1)
		communityPermissions: CommunityPermissions!
    community: Community! @cost(complexity: 1)
		threadConnection(first: Int = 10, after: String): ChannelThreadsConnection! @cost(complexity: 1, multiplier: "first")
    memberConnection(first: Int = 10, after: String): ChannelMembersConnection! @cost(complexity: 1, multiplier: "first")
		memberCount: Int!
    metaData: ChannelMetaData @cost(complexity: 1)
    pendingUsers: [User] @cost(complexity: 3)
		blockedUsers: [User] @cost(complexity: 3)
		moderators: [User] @cost(complexity: 3)
		owners: [User] @cost(complexity: 3)
		joinSettings: JoinSettings 
		slackSettings: ChannelSlackSettings
	}

	extend type Query {
    channel(id: ID, channelSlug: LowercaseString, communitySlug: LowercaseString): Channel @cost(complexity: 1)
	}

	input ArchiveChannelInput {
		channelId: ID!
	}

	input RestoreChannelInput {
		channelId: ID!
	}

	input JoinChannelWithTokenInput {
		communitySlug: LowercaseString!
		channelSlug: LowercaseString!
		token: String!
	}

	input EnableChannelTokenJoinInput {
		id: ID!
	}

	input DisableChannelTokenJoinInput {
		id: ID!
	}

	input ResetChannelJoinTokenInput {
		id: ID!
	}

	extend type Mutation {
		createChannel(input: CreateChannelInput!): Channel
		editChannel(input: EditChannelInput!): Channel
		deleteChannel(channelId: ID!): Boolean
		toggleChannelSubscription(channelId: ID!): Channel
		joinChannelWithToken(input: JoinChannelWithTokenInput!): Channel
		toggleChannelNotifications(channelId: ID!): Channel
		togglePendingUser(input: TogglePendingUserInput!): Channel
		unblockUser(input: UnblockUserInput!): Channel
		archiveChannel(input: ArchiveChannelInput!): Channel
		restoreChannel(input: RestoreChannelInput!): Channel
		enableChannelTokenJoin(input: EnableChannelTokenJoinInput!): Channel
		disableChannelTokenJoin(input: DisableChannelTokenJoinInput!): Channel
		resetChannelJoinToken(input: ResetChannelJoinTokenInput!): Channel
	}
`;

module.exports = Channel;
