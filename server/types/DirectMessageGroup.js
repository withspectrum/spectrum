const DirectMessageGroup = /* GraphQL */ `
	type DirectMessageUser {
		user: User!
		lastActivity: Date
		lastSeen: Date
	}

	type DirectMessagesConnection {
		pageInfo: PageInfo!
		edges: [DirectMessageEdge!]
	}

	type DirectMessageEdge {
		cursor: String!
		node: Message!
	}

	type DirectMessageGroup {
		id: ID!
		users: [DirectMessageUser!]
		messageConnection(first: Int = 10, after: String): DirectMessagesConnection!
		creator: User!
		lastActivity: Date!
	}

	extend type Query {
		directMessageGroup(id: ID!): DirectMessageGroup
	}

	input DirectMessageGroupInput {
		# TODO: This should just be the currently authed user
		creator: ID!
		users: [ID!]
	}

	extend type Mutation {
		addDirectMessageGroup(directMessageGroup: DirectMessageGroupInput!): DirectMessageGroup
	}
`;

module.exports = DirectMessageGroup;
