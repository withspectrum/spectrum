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

	type Thread {
		id: ID!
		createdAt: Date!
		modifiedAt: Date!
		channel: Channel!
		community: Community!
		channelPermissions: ChannelPermissions!
		communityPermissions: CommunityPermissions!
		isPublished: Boolean!
		content: ThreadContent!
		isLocked: Boolean
		isCreator: Boolean
		edits: [Edit!]
		participants: [User]
		messageConnection(first: Int = 10, after: String): ThreadMessagesConnection!
		messageCount: Int
		creator: User!
	}

	extend type Query {
		thread(id: ID!): Thread
	}

	input ThreadContentInput {
		title: String!
		body: String
		media: String
	}

	input ThreadInput {
		channelId: ID!
		communityId: ID!
		content: ThreadContentInput!
	}

	extend type Mutation {
		publishThread(thread: ThreadInput!): Thread
		editThread(threadId: ID!, newContent: ThreadContentInput!): Thread
		setThreadLock(threadId: ID!, value: Boolean!): Thread
		deleteThread(threadId: ID!): Boolean
	}
`;

module.exports = Thread;
