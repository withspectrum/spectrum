// @flow
const Community = /* GraphQL */ `
	type CommunityChannelsConnection {
		pageInfo: PageInfo!
		edges: [CommunityChannelEdge!]
	}

	type CommunityChannelEdge {
		node: Channel!
	}

	type CommunityMembersConnection {
		pageInfo: PageInfo!
		edges: [CommunityMemberEdge!]
	}

	type CommunityMemberEdge {
		cursor: String!
		node: User!
	}

	type CommunityThreadsConnection {
		pageInfo: PageInfo!
		edges: [CommunityThreadEdge!]
	}

	type CommunityThreadEdge {
		cursor: String!
		node: Thread!
	}

	type CommunityMetaData {
		members: Int
		channels: Int
	}

	type SlackImport {
		members: String
		teamName: String
		sent: Date
	}

	input CreateCommunityInput {
		name: String!
		slug: String!
		description: String!
		website: String
		file: File
		coverFile: File
	}

	input EditCommunityInput {
		name: String
		description: String
		website: String
		file: File
		coverFile: File
		communityId: ID!
	}

	input SendSlackInvitesInput {
		id: ID!
		customMessage: String
	}

	input UpgradeCommunityInput {
		plan: String!
		token: String!
		communityId: String!
	}

	input DowngradeCommunityInput {
		id: String!
	}

	type TopAndNewThreads {
		topThreads: [Thread]
		newThreads: [Thread]
	}

	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		description: String!
		website: String
		profilePhoto: String
		coverPhoto: String
		reputation: Int
		pinnedThreadId: String
		pinnedThread: Thread
		communityPermissions: CommunityPermissions
		channelConnection: CommunityChannelsConnection!
		memberConnection(first: Amount = 10, after: String): CommunityMembersConnection!
		threadConnection(first: Amount = 10, after: String): CommunityThreadsConnection!
		metaData: CommunityMetaData
		slackImport: SlackImport
		invoices: [Invoice]
		recurringPayments: [RecurringPayment]
		isPro: Boolean
		memberGrowth: GrowthData
		conversationGrowth: GrowthData
		topMembers: [User]
		topAndNewThreads: TopAndNewThreads
		contextPermissions: ContextPermissions
		watercooler: Thread
	}

	extend type Query {
		community(id: ID, slug: String): Community
		communities(slugs: [String], ids: [ID], curatedContentType: String): [Community]
		topCommunities(amount: Amount = 20): [Community!]
		recentCommunities: [Community!]
		searchCommunities(string: String, amount: Amount = 20): [Community] @deprecated(reason:"Use the new Search query endpoint")
		searchCommunityThreads(communityId: ID!, searchString: String): [Thread] @deprecated(reason:"Use the new Search query endpoint")
	}

	extend type Mutation {
		createCommunity(input: CreateCommunityInput!): Community
		editCommunity(input: EditCommunityInput!): Community
		deleteCommunity(communityId: ID!): Boolean
		toggleCommunityMembership(communityId: ID!): Community
		sendSlackInvites(input: SendSlackInvitesInput!): Community
		sendEmailInvites(input: EmailInvitesInput!): Boolean
		pinThread(threadId: ID!, communityId: ID!, value: String): Community
		upgradeCommunity(input: UpgradeCommunityInput!): Community
		downgradeCommunity(input: DowngradeCommunityInput!): Community
	}
`;

module.exports = Community;
