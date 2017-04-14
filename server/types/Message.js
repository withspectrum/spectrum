const Message = /* GraphQL */ `
	enum MessageType {
		text
		media
	}

	# Tables in the database
	enum MessageLocation {
		messages
		direct_messages
	}

	# Thread types a message can belong to
	enum ThreadTypes {
		Story
		DirectMessageGroup
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
	}

	extend type Query {
		message(
			location: MessageLocation!,
			id: ID!
		): Message
	}

	input MessageContentInput {
		type: MessageType!
		content: String!
	}

	input MessageInput {
		thread: ID!
		sender: ID!
		message: MessageContentInput!
	}

	extend type Mutation {
		addMessage(location: MessageLocation!, message: MessageInput!): Message
	}

	extend type Subscription {
		messageAdded(location: MessageLocation!, thread: ID!): Message
	}
`;

module.exports = Message;
