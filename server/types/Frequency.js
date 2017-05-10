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
	}

	input EditFrequencyInput {
		name: String
		slug: String
		description: String
		id: ID!
	}

	type Frequency {
		id: ID!
		createdAt: Date!
		modifiedAt: Date
		name: String!
		description: String!
		slug: String!
		community: Community!
		isOwner: Boolean
		storyConnection(first: Int = 10, after: String): FrequencyStoriesConnection!
		subscriberConnection(first: Int = 10, after: String): FrequencySubscribersConnection!
		subscriberCount: Int!
		metaData: FrequencyMetaData
	}

	extend type Query {
		frequency(id: ID, slug: String, community: String): Frequency
		topFrequencies(amount: Int = 30): [Frequency!]
	}

	extend type Mutation {
		createFrequency(input: CreateFrequencyInput!): Frequency
		editFrequency(input: EditFrequencyInput!): Frequency
		deleteFrequency(id: ID!): Boolean
	}
`;

module.exports = Frequency;
