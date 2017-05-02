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

	type Frequency {
		id: ID!
		createdAt: Date!
		modifiedAt: Date
		name: String!
		description: String!
		slug: String!
		community: Community!
		storyConnection(first: Int = 10, after: String): FrequencyStoriesConnection!
		subscriberConnection(first: Int = 10, after: String): FrequencySubscribersConnection!
		subscriberCount: Int!
		metaData: FrequencyMetaData
	}

	extend type Query {
		frequency(id: ID, slug: String, community: String): Frequency
		topFrequencies(amount: Int = 30): [Frequency!]
	}
`;

module.exports = Frequency;
