const Community = /* GraphQL */ `
	type CommunityFrequenciesConnection {
		pageInfo: PageInfo!
		edges: [CommunityFrequencyEdge!]
	}

	type CommunityFrequencyEdge {
		node: Frequency!
	}

	type CommunityMembersConnection {
		pageInfo: PageInfo!
		edges: [CommunityMemberEdge!]
	}

	type CommunityMemberEdge {
		cursor: String!
		node: User!
	}

	type CommunityStoriesConnection {
		pageInfo: PageInfo!
		edges: [CommunityStoryEdge!]
	}

	type CommunityStoryEdge {
		cursor: String!
		node: Story!
	}

	type CommunityMetaData {
		members: Int
		frequencies: Int
	}

	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		description: String!
		frequencyConnection: CommunityFrequenciesConnection!
		memberConnection(first: Int = 10, after: String): CommunityMembersConnection!
		storyConnection(first: Int = 10, after: String): CommunityStoriesConnection!
		metaData: CommunityMetaData
	}

	extend type Query {
		community(id: ID, slug: String): Community
	}

	extend type Mutation {
		createCommunity(name: String!, slug: String!): Community
	}
`;

module.exports = Community;
