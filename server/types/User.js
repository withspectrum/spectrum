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

	type EverythingStoriesConnection {
		pageInfo: PageInfo!
		edges: [EverythingStoryEdge!]
	}

	type EverythingStoryEdge {
		cursor: String!
		node: Story!
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
		everything(first: Int = 10, after: String): EverythingStoriesConnection!
	}

	extend type Query {
		user(id: ID!): User
	}
`;

module.exports = User;
