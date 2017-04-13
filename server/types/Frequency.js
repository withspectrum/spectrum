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
		subscribers: [User!]
	}

	extend type Query {
		frequency(id: ID!): Frequency
	}
`;

module.exports = Frequency;
