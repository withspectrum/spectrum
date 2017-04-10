const Frequency = /* GraphQL */ `
	type Frequency {
		id: ID!
		createdAt: Date!
		modifiedAt: Date
		name: String!
		description: String!
		slug: String!
		community: Community!
		stories: [Story!]
	}
`;

module.exports = Frequency;
