const Message = /* GraphQL */ `
	enum MessageType {
		text
		media
	}

	enum ThreadTypes {
		Story
		DirectMessageGroup
	}

	# Tables in the database
	enum MessageLocation {
		messages
		direct_messages
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
			location: MessageLocation!,
			id: ID!
		): Message
	}


	extend type Mutation {
		addMessage(location: MessageLocation!, message: MessageInput!): Message
	}

	extend type Subscription {
		messageAdded(location: MessageLocation!, thread: ID!): Message
	}
`;

module.exports = Message;
