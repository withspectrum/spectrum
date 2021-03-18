// @flow
const Message = /* GraphQL */ `
  enum MessageTypes {
    text
    media
    draftjs
  }

  enum ThreadTypes {
    story
    directMessageThread
  }

  type MessageContent {
    body: String!
  }

  type ReactionData {
    count: Int!
    hasReacted: Boolean
  }

  type AttachmentData {
    name: String
    url: String
  }

  type MessageAttachment {
    attachmentType: String
    data: AttachmentData
  }

  type Message @cacheControl(maxAge: 600) {
    id: ID!
    timestamp: Date!
    thread: Thread
    content: MessageContent!
    author: ThreadParticipant! @cost(complexity: 2)
    reactions: ReactionData @cost(complexity: 1)
    messageType: MessageTypes!
    attachments: [MessageAttachment]
    parent: Message
    modifiedAt: Date
    bot: Boolean
    sender: User! @deprecated(reason: "Use Message.author field instead")
  }

  input MessageContentInput {
    body: String
  }

  input AttachmentDataInput {
    name: String
    url: String
  }

  input MessageAttachmentInput {
    attachmentType: String
    data: AttachmentDataInput
  }

  input MessageInput {
    threadId: ID!
    threadType: ThreadTypes!
    messageType: MessageTypes!
    content: MessageContentInput!
    attachments: [MessageAttachmentInput]
    parentId: String
    file: Upload
  }

  extend type Query {
    message(id: ID!): Message
    getMediaMessagesForThread(threadId: ID!): [Message]
  }

  input EditMessageInput {
    id: ID!
    messageType: MessageTypes!
    content: MessageContentInput
  }

  extend type Mutation {
    addMessage(message: MessageInput!): Message
      @rateLimit(max: 30, window: "1m")
    deleteMessage(id: ID!): Boolean
    editMessage(input: EditMessageInput!): Message
  }

  extend type Subscription {
    messageAdded(thread: ID!): Message
  }
`;

module.exports = Message;
