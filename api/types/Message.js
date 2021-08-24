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

  type Message @cacheControl(maxAge: 600) {
    id: ID!
    timestamp: Date!
    thread: Thread
    content: MessageContent!
    author: ThreadParticipant! @cost(complexity: 2)
    reactions: ReactionData @cost(complexity: 1)
    messageType: MessageTypes!
    parent: Message
    modifiedAt: Date
    bot: Boolean
    sender: User! @deprecated(reason: "Use Message.author field instead")
  }

  extend type Query {
    message(id: ID!): Message
    getMediaMessagesForThread(threadId: ID!): [Message]
  }

  extend type Mutation {
    deleteMessage(id: ID!): Boolean
  }
`;

module.exports = Message;
