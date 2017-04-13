const Community = /* GraphQL */ `
	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		frequencies: [Frequency!]
		members: [User!]
	}

	extend type Query {
		community(id: ID!): Community
	}
`;

module.exports = Community;
