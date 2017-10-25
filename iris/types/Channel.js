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
		slug: String!
		description: String
		communityId: ID!
		isPrivate: Boolean
		isDefault: Boolean
	}

	input EditChannelInput {
		name: String
		slug: String
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

	type Channel @cacheControl(maxAge: 86400) {
		id: ID!
		createdAt: Date!
		modifiedAt: Date
		name: String!
		description: String!
		slug: String!
		isPrivate: Boolean
    isDefault: Boolean
		channelPermissions: ChannelPermissions! @cacheControl(scope: PRIVATE)
		communityPermissions: CommunityPermissions! @cacheControl(scope: PRIVATE)
		community: Community!
		threadConnection(first: Int = 20, after: String): ChannelThreadsConnection! @cacheContrl(maxAge: 0)
		memberConnection(first: Int = 20, after: String): ChannelMembersConnection!
		memberCount: Int!
		metaData: ChannelMetaData
		pendingUsers: [User]
		blockedUsers: [User]
		moderators: [User]
		owners: [User]
	}

	extend type Query {
		channel(id: ID, channelSlug: String, communitySlug: String): Channel
	}

	extend type Mutation {
		createChannel(input: CreateChannelInput!): Channel
		editChannel(input: EditChannelInput!): Channel
		deleteChannel(channelId: ID!): Boolean
		toggleChannelSubscription(channelId: ID!): Channel
		toggleChannelNotifications(channelId: ID!): Channel
		togglePendingUser(input: TogglePendingUserInput!): Channel
		unblockUser(input: UnblockUserInput!): Channel
	}
`;

module.exports = Channel;
