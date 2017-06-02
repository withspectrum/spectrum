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

	type FooType {
		count: Int!
		hasReacted: Boolean
	}

	# A message
	type Message {
		id: ID!
		timestamp: Date!
		thread: ID!
		content: MessageContent!
		sender: User!
		reactions: FooType
		messageType: MessageTypes!
	}

	input MessageContentInput {
		body: String
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
		getMediaMessagesForThread(threadId: ID!): [Message]
	}


	extend type Mutation {
		addMessage(message: MessageInput!): Message
	}

	extend type Subscription {
		messageAdded(thread: ID!): Message
	}
`;

module.exports = Message;
