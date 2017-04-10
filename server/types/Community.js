const Community = /* GraphQL */ `
	type Community {
		id: ID!
		createdAt: Int!
		name: String!
		slug: String!
		frequencies: [Frequency!]
	}
`;

module.exports = Community;
