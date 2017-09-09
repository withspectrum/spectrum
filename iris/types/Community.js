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

	input EmailInviteContactInput {
		email: String!
		firstName: String
		lastName: String
	}

	input EmailInvitesInput {
		id: ID!
		contacts: [ EmailInviteContactInput ]
		customMessage: String
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

	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		description: String!
		website: String
		profilePhoto: String
		coverPhoto: String
		isOwner: Boolean
		isMember: Boolean
		isModerator: Boolean
		isBlocked: Boolean
		pinnedThreadId: String
		communityPermissions: CommunityPermissions!
		channelConnection: CommunityChannelsConnection!
		memberConnection(first: Int = 20, after: String): CommunityMembersConnection!
		threadConnection(first: Int = 10, after: String): CommunityThreadsConnection!
		metaData: CommunityMetaData
		slackImport: SlackImport
		invoices: [Invoice]
		recurringPayments: [RecurringPayment]
		isPro: Boolean
	}

	extend type Query {
		community(id: ID, slug: String): Community
		topCommunities(amount: Int = 20): [Community!]
		recentCommunities: [Community!]
		searchCommunities(string: String): [Community]
		searchCommunityThreads(communityId: ID!, searchString: String): [Thread]
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
