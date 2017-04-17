const DirectMessageGroup = /* GraphQL */ `
	type DirectMessageUser {
		user: User!
		lastActivity: Date
		lastSeen: Date
	}

	type DirectMessageGroup {
		id: ID!
		users: [DirectMessageUser!]
		messages: [Message!]
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
