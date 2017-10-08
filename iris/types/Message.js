// @flow
const Message = /* GraphQL */ `
	enum MessageTypes {
		text
		media
		draftjs
	}

	enum ThreadTypes {
		story
		directMessageThread
	}

	# The content and type of a message
	type MessageContent {
		body: String!
	}

	type ReactionData {
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
		reactions: ReactionData
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
        deleteMessage(id: ID!): Boolean
	}

	extend type Subscription {
		messageAdded(thread: ID!): Message
	}
`;

module.exports = Message;
