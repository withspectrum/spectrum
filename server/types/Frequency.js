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
	}

	extend type Query {
		frequency(id: ID, slug: String, community: String): Frequency
	}
`;

module.exports = Frequency;
