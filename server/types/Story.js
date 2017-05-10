const Story = /* GraphQL */ `
	type StoryMessagesConnection {
		pageInfo: PageInfo!
		edges: [StoryMessageEdge!]
	}

	type StoryMessageEdge {
		cursor: String!
		node: Message!
	}

	# The contents of a story
	type StoryContent {
		title: String!
		description: String
		media: String
	}

	type Edit {
		timestamp: Date!
		content: StoryContent!
	}

	type Story {
		id: ID!
		createdAt: Date!
		modifiedAt: Date!
		frequency: Frequency!
		community: Community!
		published: Boolean!
		content: StoryContent!
		locked: Boolean
		edits: [Edit!]
		participants: [User]
		messageConnection(first: Int = 10, after: String): StoryMessagesConnection!
		messageCount: Int
		author: User!
	}

	extend type Query {
		story(id: ID!): Story
	}

	input StoryContentInput {
		title: String!
		description: String
		media: String
	}

	input StoryInput {
		frequency: ID!
		community: ID!
		content: StoryContentInput!
	}

	extend type Mutation {
		publishStory(story: StoryInput!): Story
		editStory(id: ID!, newContent: StoryContentInput!): Story
		setStoryLock(id: ID!, value: Boolean!): Story
		deleteStory(id: ID!): Boolean
	}
`;

module.exports = Story;
