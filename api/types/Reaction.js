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
`;

module.exports = Reaction;
