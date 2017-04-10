const Story = /* GraphQL */ `
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
`;

module.exports = Story;
