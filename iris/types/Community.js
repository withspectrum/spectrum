const Community = /* GraphQL */ `
	type CommunityChannelsConnection {
		pageInfo: PageInfo!
		edges: [CommunityChannelEdge!]
	}

	type CommunityChannelEdge {
		node: Channel!
	}

	type CommunityMembersConnection {
		pageInfo: PageInfo!
		edges: [CommunityMemberEdge!]
	}

	type CommunityMemberEdge {
		cursor: String!
		node: User!
	}

	type CommunityThreadsConnection {
		pageInfo: PageInfo!
		edges: [CommunityThreadEdge!]
	}

	type CommunityThreadEdge {
		cursor: String!
		node: Thread!
	}

	type CommunityMetaData {
		members: Int
		channels: Int
	}

	input CreateCommunityInput {
		name: String!
		slug: String!
		description: String!
		website: String
		file: File
		coverFile: File
	}

	input EditCommunityInput {
		name: String
		description: String
		website: String
		file: File
		coverFile: File
		communityId: ID!
	}

	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		description: String!
		website: String
		profilePhoto: String
		coverPhoto: String
		isOwner: Boolean
		isMember: Boolean
		isModerator: Boolean
		isBlocked: Boolean
		communityPermissions: CommunityPermissions!
		channelConnection: CommunityChannelsConnection!
		memberConnection(first: Int = 20, after: String): CommunityMembersConnection!
		threadConnection(first: Int = 10, after: String): CommunityThreadsConnection!
		metaData: CommunityMetaData
	}

	extend type Query {
		community(id: ID, slug: String): Community
		topCommunities(amount: Int = 10): [Community!]
		recentCommunities: [Community!]
	}

	extend type Mutation {
		createCommunity(input: CreateCommunityInput!): Community
		# todo return the community + channel objects to update the store
		editCommunity(input: EditCommunityInput!): Community
		# todo return the community + channel objects to clear the store
		deleteCommunity(communityId: ID!): Boolean
		# todo return the community object to update the store on client
		toggleCommunityMembership(communityId: ID!): Community
	}
`;

module.exports = Community;
