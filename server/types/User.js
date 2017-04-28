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

	type UserDirectMessageGroupsConnection {
		pageInfo: PageInfo!
		edges: [DirectMessageGroupEdge]
	}

	type DirectMessageGroupEdge {
		cursor: String!
		node: DirectMessageGroup!
	}

	type EverythingStoriesConnection {
		pageInfo: PageInfo!
		edges: [EverythingStoryEdge!]
	}

	type EverythingStoryEdge {
		cursor: String!
		node: Story!
	}

	type UserNotificationsConnection {
		pageInfo: PageInfo!
		edges: [UserNotificationEdge!]
	}

	type UserNotificationEdge {
		cursor: String!
		node: Notification!
	}

	type UserMetaData {
		stories: Int
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
		directMessageGroupsConnection: UserDirectMessageGroupsConnection!
		everything(first: Int = 10, after: String): EverythingStoriesConnection!
		metaData: UserMetaData!
		notificationConnection(first: Int = 10, after: String): UserNotificationsConnection!
	}

	extend type Query {
		user(id: ID!): User
		currentUser: User
	}
`;

module.exports = User;
