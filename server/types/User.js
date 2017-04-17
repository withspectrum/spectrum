const User = /* GraphQL */ `
	type UserCommunitiesConnection {
		pageInfo: PageInfo!
		edges: [UserCommunityEdge!]
	}

	type UserCommunityEdge {
		node: Community!
	}

	type UserFrequenciesConnection {
		pageInfo: PageInfo!
		edges: [UserFrequencyEdge!]
	}

	type UserFrequencyEdge {
		node: Frequency!
	}

	type User {
		uid: ID!
		createdAt: Date!
		lastSeen: Date!
		photoURL: String
		displayName: String
		username: String
		email: String
		# subscriptions: [Subscription!]
		communityConnection: UserCommunitiesConnection!
		frequencyConnection: UserFrequenciesConnection!
	}

	extend type Query {
		user(id: ID!): User
	}
`;

module.exports = User;
