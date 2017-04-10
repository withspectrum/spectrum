const Frequency = /* GraphQL */ `
	type Frequency {
		id: ID!
		createdAt: Int!
		modifiedAt: Int
		name: String!
		description: String!
		slug: String!
		community: Community!
		stories: [Story!]
	}
`;

module.exports = Frequency;
