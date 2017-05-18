const Message = /* GraphQL */ `
	enum MessageType {
		text
		media
	}

	enum ThreadTypes {
		Thread
		DirectMessageThread
	}

	# The content and type of a message
	type MessageContent {
		type: MessageType!
		content: String!
	}

	# A message
	type Message {
		id: ID!
		timestamp: Date!
		thread: ThreadTypes!
		message: MessageContent!
		sender: User!
		reactions: [Reaction]
	}

	input MessageContentInput {
		type: MessageType!
		content: String!
	}

	input MessageInput {
		thread: ID!
		message: MessageContentInput!
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
