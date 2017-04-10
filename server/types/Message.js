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
`;

module.exports = Message;
