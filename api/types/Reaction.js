// @flow
const Reaction = /* GraphQL */ `
  enum ReactionTypes {
    like
  }

  type Reaction @cacheControl(maxAge: 84700) {
    id: ID!
    timestamp: Date!
    message: Message!
    user: User!
    type: ReactionTypes!
  }

  input ReactionInput {
    messageId: ID!
    type: ReactionTypes!
  }

  extend type Query {
    reaction(id: String!): Reaction
  }

  extend type Mutation {
    # Returns true if toggling completed successfully
    toggleReaction(reaction: ReactionInput!): Message
  }
`;

module.exports = Reaction;
