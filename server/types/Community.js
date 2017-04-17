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
		node: User!
	}

	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		frequencyConnections: CommunityFrequenciesConnection!
		memberConnections: CommunityMembersConnection!
	}

	extend type Query {
		community(id: ID!): Community
	}
`;

module.exports = Community;
