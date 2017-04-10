const Message = /* GraphQL */ `
	enum MessageType {
		text
		media
	}

	type MessageContent {
		type: MessageType!
		content: String!
	}

	type Message {
		id: ID!
		timestamp: Date!
		story: Story!
		message: MessageContent!
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
`;

module.exports = Message;
