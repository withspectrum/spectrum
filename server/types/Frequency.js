const Timestamped = require('./interfaces/Timestamped');

const Frequency = /* GraphQL */ `
	type Frequency implements Timestamped {
		id: ID!
		createdAt: Int!
		modifiedAt: Int
		name: String!
		description: String!
		slug: String!
		# community: Community!
		stories: [Story!]
	}
`;

module.exports = () => [Timestamped, Frequency];
