const DirectMessageGroup = /* GraphQL */ `
	type DirectMessageGroup {
		id: ID!
		users: [User!]
		messages: [Message!]
		creator: User!
		lastActivity: Date!
		snippet: String!
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
