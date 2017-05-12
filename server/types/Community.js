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

	input File {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

	input CreateCommunityInput {
		name: String!
		slug: String!
		description: String!
		website: String,
		file: File
	}

	input EditCommunityInput {
		name: String
		slug: String
		description: String
		website: String
		file: File
		id: ID!
	}

	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		description: String!
		website: String
		photoURL: String
		isOwner: Boolean
		isMember: Boolean
		frequencyConnection: CommunityFrequenciesConnection!
		memberConnection(first: Int = 10, after: String): CommunityMembersConnection!
		storyConnection(first: Int = 10, after: String): CommunityStoriesConnection!
		metaData: CommunityMetaData
	}

	extend type Query {
		community(id: ID, slug: String): Community
	}

	extend type Mutation {
		createCommunity(input: CreateCommunityInput!): Community
		# todo return the community + frequency objects to update the store
		editCommunity(input: EditCommunityInput!): Community
		# todo return the community + frequency objects to clear the store
		deleteCommunity(id: ID!): Boolean
		# todo return the community object to update the store on client
		toggleCommunityMembership(id: ID!): Community
	}
`;

module.exports = Community;
