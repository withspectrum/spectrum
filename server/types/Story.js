const Timestamped = require('./interfaces/Timestamped');
const Frequency = require('./Frequency');

const Story = /* GraphQL */ `
	type Content {
		title: String!
		description: String
		media: String
	}

	type Story implements Timestamped {
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

module.exports = () => [Timestamped, Frequency, Story];
