// @flow
const Community = /* GraphQL */ `
	type CommunityChannelsConnection {
		pageInfo: PageInfo!
		edges: [CommunityChannelEdge!]
	}

	type CommunityChannelEdge {
		node: Channel!
	}

	type CommunityMembersConnection @deprecated(reason:"Use the new Community.members type") {
		pageInfo: PageInfo!
		edges: [CommunityMemberEdge!]
	}

	type CommunityMemberEdge @deprecated(reason:"Use the new Community.members type") {
		cursor: String!
		node: User!
	}

	type CommunityMembers {
		pageInfo: PageInfo!
		edges: [CommunityMembersEdge!]
	}

	type CommunityMembersEdge {
		cursor: String!
		node: CommunityMember!
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

	type TopAndNewThreads {
		topThreads: [Thread]
		newThreads: [Thread]
	}

	type BrandedLogin {
		isEnabled: Boolean
		message: String
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
    communityPermissions: CommunityPermissions @cost(complexity: 1)
    channelConnection: CommunityChannelsConnection! @cost(complexity: 1)
    members(first: Int = 10, after: String, filter: MembersFilter): CommunityMembers! @cost(complexity: 5, multiplier: "first")
    threadConnection(first: Int = 10, after: String): CommunityThreadsConnection! @cost(complexity: 2, multiplier: "first")
    metaData: CommunityMetaData @cost(complexity: 10)
    slackImport: SlackImport @cost(complexity: 2)
    invoices: [Invoice] @cost(complexity: 1)
		recurringPayments: [RecurringPayment]
    isPro: Boolean @cost(complexity: 1)
    memberGrowth: GrowthData @cost(complexity: 10)
    conversationGrowth: GrowthData @cost(complexity: 3)
    topMembers: [User] @cost(complexity: 10)
    topAndNewThreads: TopAndNewThreads @cost(complexity: 4)
		watercooler: Thread
		brandedLogin: BrandedLogin

		memberConnection(first: Int = 10, after: String, filter: MemberConnectionFilter): CommunityMembersConnection! @deprecated(reason:"Use the new Community.members type")
		contextPermissions: ContextPermissions @deprecated(reason:"Use the new CommunityMember type to get permissions")
	}

	extend type Query {
		community(id: ID, slug: String): Community
		communities(slugs: [String], ids: [ID], curatedContentType: String): [Community]
		communityMember(userId: String, communityId: String): CommunityMember
    topCommunities(amount: Int = 20): [Community!] @cost(complexity: 4, multiplier: "amount")
		recentCommunities: [Community!]

		searchCommunities(string: String, amount: Int = 20): [Community] @deprecated(reason:"Use the new Search query endpoint")
		searchCommunityThreads(communityId: ID!, searchString: String): [Thread] @deprecated(reason:"Use the new Search query endpoint")
	}

	input MembersFilter {
		isOwner: Boolean
		isMember: Boolean
		isBlocked: Boolean
		isPending: Boolean
		isModerator: Boolean
	}

	input MemberConnectionFilter @deprecated(reason: "Use the new MembersFilter input type") {
		isOwner: Boolean
		isMember: Boolean
		isBlocked: Boolean
		isPending: Boolean
		isModerator: Boolean
	}

	input CreateCommunityInput {
		name: String!
		slug: String!
		description: String!
		website: String
		file: Upload
		coverFile: Upload
	}

	input EditCommunityInput {
		name: String
		description: String
		website: String
		file: Upload
		coverFile: Upload
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

	input EnableBrandedLoginInput {
		id: String!
	}

	input DisableBrandedLoginInput {
		id: String!
	}

	input SaveBrandedLoginSettingsInput {
		id: String!
		message: String
	}

	extend type Mutation {
		createCommunity(input: CreateCommunityInput!): Community
		editCommunity(input: EditCommunityInput!): Community
		deleteCommunity(communityId: ID!): Boolean
		toggleCommunityMembership(communityId: ID!): Community @deprecated(reason:"Use the new addCommunityMember or removeCommunityMember mutations")
		sendSlackInvites(input: SendSlackInvitesInput!): Community
		sendEmailInvites(input: EmailInvitesInput!): Boolean
		pinThread(threadId: ID!, communityId: ID!, value: String): Community
		upgradeCommunity(input: UpgradeCommunityInput!): Community
		downgradeCommunity(input: DowngradeCommunityInput!): Community
		enableBrandedLogin(input: EnableBrandedLoginInput!): Community
		disableBrandedLogin(input: DisableBrandedLoginInput!): Community
		saveBrandedLoginSettings(input: SaveBrandedLoginSettingsInput!): Community
	}
`;

module.exports = Community;
