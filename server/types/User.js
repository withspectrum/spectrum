const User = /* GraphQL */ `
	type User {
		uid: ID!
		createdAt: Date!
		lastSeen: Date!
		photoURL: String
		displayName: String
		username: String
		email: String
		# subscriptions: [Subscription!]
		communities: [Community!]
		frequencies: [Frequency!]
	}

	extend type Query {
		user(id: ID!): User
	}
`;

module.exports = User;
