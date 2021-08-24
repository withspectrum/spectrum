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

  extend type Query {
    thread(id: ID!): Thread @cacheControl(maxAge: 1200)
  }

  input AttachmentInput {
    attachmentType: String
    data: String
  }

  input ThreadContentInput {
    title: String
    body: String
  }

  extend type Mutation {
    deleteThread(threadId: ID!): Boolean
  }
`;

module.exports = Thread;
