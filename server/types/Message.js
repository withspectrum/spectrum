const Message = /* GraphQL */ `
	enum MessageType {
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
		thread: ThreadTypes!
		content: MessageContent!
		sender: User!
		reactions: [Reaction]
		type: MessageType!
	}

	input MessageContentInput {
		body: String!
	}

	input MessageInput {
		threadId: ID!
		type: ThreadTypes!
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
