// @flow
const Thread = /* GraphQL */ `
  type ThreadMessagesConnection {
    pageInfo: PageInfo!
    edges: [ThreadMessageEdge!]
  }

  type ThreadMessageEdge {
    cursor: String!
    node: Message!
  }

  # The contents of a thread
  type ThreadContent {
    title: String
    body: String
    media: String
  }

  type Edit {
    timestamp: Date!
    content: ThreadContent!
  }

  enum ThreadType {
    SLATE
    DRAFTJS
    TEXT
  }

  type Attachment {
    attachmentType: String
    data: String
  }

  type Thread {
    id: ID!
    createdAt: Date!
    modifiedAt: Date
    channel: Channel!
    community: Community! @cost(complexity: 1)
    isPublished: Boolean!
    content: ThreadContent!
    isLocked: Boolean
    isAuthor: Boolean
    receiveNotifications: Boolean @cost(complexity: 1)
    lastActive: Date
    type: ThreadType
    edits: [Edit!]
    participants: [User] @cost(complexity: 1)
    messageConnection(first: Int, after: String, last: Int, before: String): ThreadMessagesConnection! @cost(complexity: 1, multiplier: "first")
    messageCount: Int @cost(complexity: 1)
    author: ThreadParticipant! @cost(complexity: 2)
    attachments: [Attachment]
    watercooler: Boolean
    currentUserLastSeen: Date @cost(complexity: 1)
    reactions: ReactionData @cost(complexity: 1)

    isCreator: Boolean @deprecated(reason: "Use Thread.isAuthor instead")
    creator: User! @deprecated(reason:"Use Thread.author instead")
  }

  input SearchThreadsFilter {
    communityId: ID
    creatorId: ID
    channelId: ID
    everythingFeed: Boolean
  }

  extend type Query {
    thread(id: ID!): Thread
    searchThreads(queryString: String!, filter: SearchThreadsFilter): [Thread] @deprecated(reason:"Use the new Search query endpoint")
  }

  input AttachmentInput {
    attachmentType: String
    data: String
  }

  input ThreadContentInput {
    title: String
    body: String
  }

  input EditThreadInput {
    threadId: ID!
    content: ThreadContentInput!
    attachments: [AttachmentInput]
    filesToUpload: [Upload]
  }

  input ThreadInput {
    channelId: ID!
    communityId: ID!
    type: ThreadType
    content: ThreadContentInput!
    attachments: [AttachmentInput]
    filesToUpload: [Upload]
  }

  input AddThreadReactionInput {
    threadId: ID!
    type: ReactionTypes
  }

  input RemoveThreadReactionInput {
    threadId: ID!
  }

  extend type Mutation {
    publishThread(thread: ThreadInput!): Thread
    editThread(input: EditThreadInput!): Thread
    setThreadLock(threadId: ID!, value: Boolean!): Thread
    toggleThreadNotifications(threadId: ID!): Thread
    deleteThread(threadId: ID!): Boolean
    moveThread(threadId: ID!, channelId: ID!): Thread
    addReaction(input: AddThreadReactionInput!): Thread
    removeReaction(input: RemoveThreadReactionInput!): Thread
  }

  extend type Subscription {
    threadUpdated(channelIds: [String!]): Thread
  }
`;

module.exports = Thread;
