const Message = /* GraphQL */ `
	enum MessageTypes {
		text
		media
	}

	enum ThreadTypes {
		story
		directMessageThread
	}

	# The content and type of a message
	type MessageContent {
		body: String!
	}

	# A message
	type Message {
		id: ID!
		timestamp: Date!
		thread: ID!
		content: MessageContent!
		sender: User!
		reactions: [Reaction]
		messageType: MessageTypes!
	}

	input MessageContentInput {
		body: String
	}

	input File {
		name: String!
		type: String!
		size: Int!
		path: String!
	}

	input MessageInput {
		threadId: ID!
		threadType: ThreadTypes!
		messageType: MessageTypes!
		content: MessageContentInput!
		file: File
	}

	extend type Query {
		message(
			id: ID!
		): Message
	}


	extend type Mutation {
		addMessage(message: MessageInput!): Message
	}

	extend type Subscription {
		messageAdded(thread: ID!): Message
	}
`;

module.exports = Message;
