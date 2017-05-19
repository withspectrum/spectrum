const DirectMessageThread = /* GraphQL */ `
	type DirectMessageUserStatus {
		userId: ID!
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

	type DirectMessageThread {
		id: ID!
		participants: [User!]
		status: [DirectMessageUserStatus!]
		messageConnection(first: Int = 10, after: String): DirectMessagesConnection!
		creator: User!
		lastActivity: Date!
		snippet: String
	}

	extend type Query {
		directMessageThread(id: ID!): DirectMessageThread
	}

	enum MessageType {
		text
		media
	}

	input MessageContentInput {
		type: MessageType!
		content: String!
	}

	input DirectMessageThreadInput {
		users: [ID!]
		message: MessageContentInput!
	}

	extend type Mutation {
		createDirectMessageThread(input: DirectMessageThreadInput!): DirectMessageThread
	}
`;

module.exports = DirectMessageThread;
