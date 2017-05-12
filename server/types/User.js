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

	type UserStoriesConnection {
		pageInfo: PageInfo!
		edges: [UserStoryEdge!]
	}

	type UserStoryEdge {
		cursor: String!
		node: Story!
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

	input File {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

	type User {
		uid: ID!
		createdAt: Date!
		lastSeen: Date!
		photoURL: String
		displayName: String
		username: String
		email: String
		storyCount: Int
		isAdmin: Boolean!
		# subscriptions: [Subscription!]
		communityConnection: UserCommunitiesConnection!
		frequencyConnection: UserFrequenciesConnection!
		directMessageGroupsConnection: UserDirectMessageGroupsConnection!
		storyConnection(first: Int = 10, after: String): UserStoriesConnection!
		everything(first: Int = 10, after: String): EverythingStoriesConnection!
		notificationConnection(first: Int = 10, after: String): UserNotificationsConnection!
	}

	extend type Query {
		user(uid: ID, username: String): User
		currentUser: User
	}

	extend type Mutation {
		uploadProfilePhoto(file: File!): User
	}
`;

module.exports = User;
