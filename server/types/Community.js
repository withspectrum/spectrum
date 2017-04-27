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

	type CommunityMetaData {
		members: Int
		frequencies: Int
	}

	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		frequencyConnection: CommunityFrequenciesConnection!
		memberConnection(first: Int = 10, after: String): CommunityMembersConnection!
		metaData: CommunityMetaData
	}

	extend type Query {
		community(id: ID!): Community
	}

	extend type Mutation {
		createCommunity(name: String!, slug: String!): Community
	}
`;

module.exports = Community;
