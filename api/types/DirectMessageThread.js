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
    lastActive: Date
    lastSeen: Date
    userId: ID!
    isOnline: Boolean
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

  enum MessageType {
    text
    media
    draftjs
  }

  input ContentInput {
    body: String!
  }

  input DirectMessageContentInput {
    messageType: MessageType!
    threadType: String!
    content: ContentInput!
    file: Upload
  }

  input DirectMessageThreadInput {
    participants: [ID!]
    message: DirectMessageContentInput!
  }

  extend type Mutation {
    createDirectMessageThread(
      input: DirectMessageThreadInput!
    ): DirectMessageThread @rateLimit(max: 10, window: "20m")
    setLastSeen(id: ID!): DirectMessageThread
  }

  extend type Subscription {
    directMessageThreadUpdated: DirectMessageThread
  }
`;

module.exports = DirectMessageThread;
