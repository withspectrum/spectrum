const Message = /* GraphQL */ `
	enum MessageType {
		text
		media
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
		story: Story!
		message: MessageContent!
		sender: User!
	}

	extend type Query {
		message(id: ID!): Message
	}

	input MessageContentInput {
		type: MessageType!
		content: String!
	}

	input MessageInput {
		story: ID!
		message: MessageContentInput!
	}

	extend type Mutation {
		addMessage(message: MessageInput!): Message
	}

	extend type Subscription {
		messageAdded(storyId: ID!): Message
	}
`;

module.exports = Message;
