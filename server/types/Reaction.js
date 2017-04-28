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

	extend type Query {
		reaction(id: String!): Reaction
	}

	extend type Mutation {
		# Returns true if toggling completed successfully
		toggleReaction(reaction: ReactionInput!): Boolean
	}
`;

module.exports = Reaction;
