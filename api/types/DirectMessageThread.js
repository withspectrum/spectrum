// @flow
const DirectMessageThread = /* GraphQL */ `
  type DirectMessagesConnection {
    pageInfo: PageInfo!
    edges: [DirectMessageEdge!]
  }

  type DirectMessageEdge {
    cursor: String!
    node: Message!
  }

  type ParticipantInfo {
    id: ID!
    name: String
    username: String
    profilePhoto: String
    userId: ID!
  }

  type DirectMessageThread {
    id: ID!
    messageConnection(
      first: Int = 20
      after: String
    ): DirectMessagesConnection! @cost(complexity: 1, multipliers: ["first"])
    participants: [ParticipantInfo]! @cost(complexity: 1)
    snippet: String @cost(complexity: 2)
    threadLastActive: Date!
  }

  extend type Query {
    directMessageThread(id: ID!): DirectMessageThread
    directMessageThreadByUserIds(userIds: [ID!]): DirectMessageThread
  }
`;

module.exports = DirectMessageThread;
