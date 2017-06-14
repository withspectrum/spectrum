const User = /* GraphQL */ `
	type UserCommunitiesConnection {
		pageInfo: PageInfo!
		edges: [UserCommunityEdge!]
	}

	type UserCommunityEdge {
		node: Community!
	}

	type UserChannelsConnection {
		pageInfo: PageInfo!
		edges: [UserChannelEdge!]
	}

	type UserChannelEdge {
		node: Channel!
	}

	type UserDirectMessageThreadsConnection {
		pageInfo: PageInfo!
		edges: [DirectMessageThreadEdge]
	}

	type DirectMessageThreadEdge {
		cursor: String!
		node: DirectMessageThread!
	}

	type UserThreadsConnection {
		pageInfo: PageInfo!
		edges: [UserThreadEdge!]
	}

	type UserThreadEdge {
		cursor: String!
		node: Thread!
	}

	type EverythingThreadsConnection {
		pageInfo: PageInfo!
		edges: [EverythingThreadEdge!]
	}

	type EverythingThreadEdge {
		cursor: String!
		node: Thread!
	}

	type UserMetaData {
		threads: Int
	}

	type RecurringPayment {
		plan: String
		amount: String
		created: String
		status: String
	}

	type User {
		id: ID!
		name: String
		description: String
		website: String
		username: String
		profilePhoto: String
		coverPhoto: String
		email: String
		providerId: String
		createdAt: Date!
		lastSeen: Date!
		isOnline: Boolean

		# non-schema fields
		threadCount: Int
		isAdmin: Boolean!
		isPro: Boolean!
		communityConnection: UserCommunitiesConnection!
		channelConnection: UserChannelsConnection!
		directMessageThreadsConnection: UserDirectMessageThreadsConnection!
		threadConnection(first: Int = 10, after: String): UserThreadsConnection!
		everything(first: Int = 10, after: String): EverythingThreadsConnection!
		recurringPayments: [RecurringPayment]
	}

	extend type Query {
		user(id: ID, username: String): User
		currentUser: User
		searchUsers(string: String): [User]
	}

	input EditUserInput {
		file: File
		coverFile: File
		name: String!
		description: String!
		website: String
	}

	input UpgradeToProInput {
		plan: String!
		token: String!
	}

	extend type Mutation {
		editUser(input: EditUserInput!): User
		upgradeToPro(input: UpgradeToProInput!): User
		downgradeFromPro: User
		setUserLastSeen(userId: ID!): User
	}
`;

module.exports = User;
