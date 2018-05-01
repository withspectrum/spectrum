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
    pendingUsers: [User] @isAuthed @cost(complexity: 3)
		blockedUsers: [User] @isAuthed @cost(complexity: 3)
		moderators: [User] @cost(complexity: 3)
		owners: [User] @cost(complexity: 3)
		joinSettings: JoinSettings 
		slackSettings: ChannelSlackSettings @isAuthed
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
		createChannel(input: CreateChannelInput!): Channel @isAuthed
		editChannel(input: EditChannelInput!): Channel @isAuthed
		deleteChannel(channelId: ID!): Boolean @isAuthed
		toggleChannelSubscription(channelId: ID!): Channel @isAuthed
		joinChannelWithToken(input: JoinChannelWithTokenInput!): Channel @isAuthed
		toggleChannelNotifications(channelId: ID!): Channel @isAuthed
		togglePendingUser(input: TogglePendingUserInput!): Channel @isAuthed
		unblockUser(input: UnblockUserInput!): Channel @isAuthed
		archiveChannel(input: ArchiveChannelInput!): Channel @isAuthed
		restoreChannel(input: RestoreChannelInput!): Channel @isAuthed
		enableChannelTokenJoin(input: EnableChannelTokenJoinInput!): Channel @isAuthed
		disableChannelTokenJoin(input: DisableChannelTokenJoinInput!): Channel @isAuthed
		resetChannelJoinToken(input: ResetChannelJoinTokenInput!): Channel @isAuthed
	}
`;

module.exports = Channel;
