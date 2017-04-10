const Story = /* GraphQL */ `
	# The contents of a story
	type StoryContent {
		title: String!
		description: String
		media: String
	}

	type Story {
		id: ID!
		createdAt: Date!
		modifiedAt: Date!
		frequency: Frequency!
		last_activity: Date!
		published: Boolean!
		content: StoryContent!
		deleted: Boolean
		messages: [Message!]
	}

	extend type Query {
		stories: [Story!]
	}
`;

module.exports = Story;
