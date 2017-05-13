const Frequency = /* GraphQL */ `
	type FrequencySubscribersConnection {
		pageInfo: PageInfo!
		edges: [FrequencySubscriberEdge!]
	}

	type FrequencySubscriberEdge {
		cursor: String!
		node: User!
	}

	type FrequencyStoriesConnection {
		pageInfo: PageInfo!
		edges: [FrequencyStoryEdge!]
	}

	type FrequencyStoryEdge {
		cursor: String!
		node: Story!
	}

	type FrequencyMetaData {
		stories: Int
		subscribers: Int
	}

	input CreateFrequencyInput {
		name: String!
		slug: String!
		description: String
		community: ID!
		isPrivate: Boolean
	}

	input EditFrequencyInput {
		name: String
		slug: String
		description: String
		isPrivate: Boolean
		id: ID!
	}

	enum PendingActionType {
		block
		approve
	}

	input TogglePendingUserInput {
		id: ID!
		uid: ID!
		action: PendingActionType!
	}

	type Frequency {
		id: ID!
		createdAt: Date!
		modifiedAt: Date
		name: String!
		description: String!
		slug: String!
		isPrivate: Boolean!
		community: Community!
		storyConnection(first: Int = 10, after: String): FrequencyStoriesConnection!
		subscriberConnection(first: Int = 10, after: String): FrequencySubscribersConnection!
		pendingUsers: [User]
		blockedUsers: [User]
		subscriberCount: Int!
		metaData: FrequencyMetaData

		# checks against the user requesting the entity data
		isOwner: Boolean
		isSubscriber: Boolean
		isPending: Boolean
		isBlocked: Boolean
	}

	extend type Query {
		frequency(id: ID, slug: String, community: String): Frequency
		topFrequencies(amount: Int = 30): [Frequency!]
	}

	extend type Mutation {
		createFrequency(input: CreateFrequencyInput!): Frequency
		editFrequency(input: EditFrequencyInput!): Frequency
		deleteFrequency(id: ID!): Boolean
		toggleFrequencySubscription(id: ID!): Frequency
		togglePendingUser(input: TogglePendingUserInput!): Frequency
	}
`;

module.exports = Frequency;
