// @flow
const Thread = /* GraphQL */ `
  enum ThreadReactionTypes {
    like
  }

  type ThreadReactions {
    count: Int!
    hasReacted: Boolean
  }

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
    # editedBy: User!
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

  type Thread @cacheControl(maxAge: 1200) {
    id: ID!
    createdAt: Date!
    modifiedAt: Date
    editedBy: ThreadParticipant @cost(complexity: 2)
    channel: Channel!
    community: Community! @cost(complexity: 1) @cacheControl(maxAge: 84700)
    isPublished: Boolean!
    content: ThreadContent!
    isLocked: Boolean
    isAuthor: Boolean
    receiveNotifications: Boolean @cost(complexity: 1)
    lastActive: Date
    type: ThreadType
    edits: [Edit!]
    messageConnection(
      first: Int
      after: String
      last: Int
      before: String
    ): ThreadMessagesConnection! @cost(complexity: 1, multipliers: ["first"])
    messageCount: Int @cost(complexity: 1)
    author: ThreadParticipant! @cost(complexity: 2)
    watercooler: Boolean
    currentUserLastSeen: Date @cost(complexity: 1)
    reactions: ThreadReactions @cost(complexity: 1)
    metaImage: String

    attachments: [Attachment]
      @deprecated(reason: "Attachments no longer used for link previews")
    isCreator: Boolean @deprecated(reason: "Use Thread.isAuthor instead")

    creator: User! @deprecated(reason: "Use Thread.author instead")
    participants: [User]
      @cost(complexity: 1)
      @deprecated(reason: "No longer used")
  }

  input SearchThreadsFilter {
    communityId: ID
    creatorId: ID
    channelId: ID
    everythingFeed: Boolean
  }

  extend type Query {
    thread(id: ID!): Thread @cacheControl(maxAge: 1200)
    searchThreads(queryString: String!, filter: SearchThreadsFilter): [Thread]
      @deprecated(reason: "Use the new Search query endpoint")
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
    type: ThreadReactionTypes
  }

  input RemoveThreadReactionInput {
    threadId: ID!
  }

  extend type Mutation {
    publishThread(thread: ThreadInput!): Thread
      @rateLimit(max: 7, window: "10m")
    editThread(input: EditThreadInput!): Thread
    setThreadLock(threadId: ID!, value: Boolean!): Thread
    toggleThreadNotifications(threadId: ID!): Thread
    deleteThread(threadId: ID!): Boolean
    moveThread(threadId: ID!, channelId: ID!): Thread
    addThreadReaction(input: AddThreadReactionInput!): Thread
    removeThreadReaction(input: RemoveThreadReactionInput!): Thread
  }

  extend type Subscription {
    threadUpdated(channelIds: [String!]): Thread
  }
`;

module.exports = Thread;
