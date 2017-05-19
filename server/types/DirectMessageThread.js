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

	input ContentInput {
		body: String!
	}

	input DirectMessageContentInput {
		messageType: MessageType!
		threadType: String!
		content: ContentInput!
	}

	input DirectMessageThreadInput {
		participants: [ID!]
		message: DirectMessageContentInput!
	}

	extend type Mutation {
		createDirectMessageThread(input: DirectMessageThreadInput!): DirectMessageThread
	}
`;

module.exports = DirectMessageThread;
