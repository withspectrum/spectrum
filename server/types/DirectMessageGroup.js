const DirectMessageGroup = /* GraphQL */ `
	# Users in a direct message group
	type DirectMessageUser {
		id: User!
		lastActivity: Date!
		lastSeen: Date!
	}

	type DirectMessageGroup {
		id: ID!
		users: [DirectMessageUser!]
		messages: [Message!]
		creator: User!
		lastActivity: Date!
		snippet: String!
	}

	extend type Query {
		directMessageGroup(id: ID!): DirectMessageGroup
	}

	input DirectMessageGroupInput {
		creator: ID!
		lastActivity: Date!
		messages: [Message!]
		users: [DirectMessageUser!]
	}

	extend type Mutation {
		addDirectMessageGroup(directMessageGroup: directMessageGroupInput!): DirectMessageGroup
	}
`;

module.exports = DirectMessageGroup;
