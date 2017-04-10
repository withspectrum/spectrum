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

	extend type Query {
		frequency(id: ID!): Frequency
		frequencies: [Frequency!]
	}
`;

module.exports = Frequency;
