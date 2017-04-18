const Reaction = /* GraphQL */ `
	enum ReactionTypes {
		like
	}

	type Reaction {
		id: ID!
		timestamp: Date!
		message(location: MessageLocation): Message!
		user: User!
		type: ReactionTypes!
	}

	input ReactionInput {
		message: ID!
		user: ID!
		type: ReactionTypes!
	}
`;

module.exports = Reaction;
