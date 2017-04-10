const Story = /* GraphQL */ `
	type Content {
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
		content: Content!
		deleted: Boolean
		# messages: [Message!]
	}
`;

module.exports = Story;
