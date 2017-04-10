const Community = /* GraphQL */ `
	type Community {
		id: ID!
		createdAt: Date!
		name: String!
		slug: String!
		frequencies: [Frequency!]
	}
`;

module.exports = Community;
