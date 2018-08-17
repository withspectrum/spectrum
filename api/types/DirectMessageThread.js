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
    archivedAt: Date @deprecated(reason: "Check the isArchived boolean instead")
    messageConnection(
      first: Int = 20
      after: String
    ): DirectMessagesConnection! @cost(complexity: 1, multiplier: "first")
    participants: [ParticipantInfo]! @cost(complexity: 1)
    snippet: String! @cost(complexity: 2)
    threadLastActive: Date!
    isArchived: Boolean
    isMuted: Boolean
    isGroup: Boolean
  }

  extend type Query {
    directMessageThread(id: ID!): DirectMessageThread
    directMessageThreadByUserId(userId: ID!): DirectMessageThread
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

  input ArchiveDMThreadInput {
    threadId: ID!
  }

  input UnarchiveDMThreadInput {
    threadId: ID!
  }

  input MuteDMThreadInput {
    threadId: ID!
  }

  input UnmuteDMThreadInput {
    threadId: ID!
  }

  input LeaveDirectMessageThreadInput {
    threadId: ID!
  }

  input DeleteDirectMessageThreadInput {
    threadId: ID!
  }

  extend type Mutation {
    createDirectMessageThread(
      input: DirectMessageThreadInput!
    ): DirectMessageThread
    setLastSeen(id: ID!): DirectMessageThread
    archiveDirectMessageThread(
      input: ArchiveDMThreadInput!
    ): DirectMessageThread
    unarchiveDirectMessageThread(
      input: UnarchiveDMThreadInput!
    ): DirectMessageThread
    muteDirectMessageThread(input: MuteDMThreadInput!): DirectMessageThread
    unmuteDirectMessageThread(input: UnmuteDMThreadInput!): DirectMessageThread
    leaveDirectMessageThread(
      input: LeaveDirectMessageThreadInput!
    ): DirectMessageThread
    deleteDirectMessageThread(
      input: DeleteDirectMessageThreadInput!
    ): DirectMessageThread
  }

  extend type Subscription {
    directMessageThreadUpdated: DirectMessageThread
  }
`;

module.exports = DirectMessageThread;
