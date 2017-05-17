const DirectMessageGroup = /* GraphQL */ `
	type DirectMessageUserStatus {
		uid: ID!
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
		users: [User!]
		status: [DirectMessageUserStatus!]
		messageConnection(first: Int = 10, after: String): DirectMessagesConnection!
		creator: User!
		lastActivity: Date!
		snippet: String
	}

	extend type Query {
		directMessageGroup(id: ID!): DirectMessageGroup
	}

	enum MessageType {
		text
		media
	}

	input MessageContentInput {
		type: MessageType!
		content: String!
	}

	input DirectMessageGroupInput {
		users: [ID!]
		message: MessageContentInput!
	}

	extend type Mutation {
		createDirectMessageGroup(input: DirectMessageGroupInput!): DirectMessageGroup
	}
`;

module.exports = DirectMessageGroup;
