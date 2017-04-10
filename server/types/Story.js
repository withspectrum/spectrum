const Story = /* GraphQL */ `
	type StoryContent {
		title: String!
		description: String
		media: String
	}

	type Story {
		id: ID!
		createdAt: Int!
		modifiedAt: Int!
		frequency: Frequency!
		last_activity: Int!
		published: Boolean!
		content: StoryContent!
		deleted: Boolean
		messages: [Message!]
	}
`;

module.exports = Story;
