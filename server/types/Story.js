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
		published: Boolean!
		content: StoryContent!
		deleted: Boolean
		locked: Boolean
		edits: [Edit!]
		messageConnection(first: Int = 10, after: String): StoryMessagesConnection!
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
		published: Boolean!
		content: StoryContentInput!
	}

	extend type Mutation {
		addStory(story: StoryInput!): Story
		publishStory(id: ID!): Story
		editStory(id: ID!, newContent: StoryContentInput!): Story
		setStoryLock(id: ID!, value: Boolean!): Story
		deleteStory(id: ID!): Boolean
	}
`;

module.exports = Story;
