const Thread = /* GraphQL */ `
	type ThreadMessagesConnection {
		pageInfo: PageInfo!
		edges: [ThreadMessageEdge!]
	}

	type ThreadMessageEdge {
		cursor: String!
		node: Message!
	}

	# The contents of a thread
	type ThreadContent {
		title: String!
		body: String
		media: String
	}

	type Edit {
		timestamp: Date!
		content: ThreadContent!
	}

	enum ThreadType {
		SLATE
	}

	type Attachment {
		attachmentType: String
		data: String
	}

	type Thread {
		id: ID!
		createdAt: Date!
		modifiedAt: Date
		channel: Channel!
		community: Community!
		isPublished: Boolean!
		content: ThreadContent!
		isLocked: Boolean
		isCreator: Boolean
		receiveNotifications: Boolean
		type: ThreadType
		edits: [Edit!]
		participants: [User]
		messageConnection(first: Int = 10, after: String): ThreadMessagesConnection!
		messageCount: Int
		creator: User!
		attachments: [Attachment]
	}

	extend type Query {
		thread(id: ID!): Thread
	}

	input AttachmentInput {
		attachmentType: String
		data: String
	}

	input ThreadContentInput {
		title: String
		body: String
	}

	input EditThreadInput {
		threadId: ID!
		content: ThreadContentInput!
		attachments: [AttachmentInput]
		filesToUpload: [File]
	}

	input ThreadInput {
		channelId: ID!
		communityId: ID!
		type: ThreadType
		content: ThreadContentInput!
		attachments: [AttachmentInput]
		filesToUpload: [File]
	}

	extend type Mutation {
		publishThread(thread: ThreadInput!): Thread
		editThread(input: EditThreadInput!): Thread
		setThreadLock(threadId: ID!, value: Boolean!): Thread
		toggleThreadNotifications(threadId: ID!): Thread
		deleteThread(threadId: ID!): Boolean
	}
`;

module.exports = Thread;
