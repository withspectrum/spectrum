// @flow
const Notification = /* GraphQL */ `
  enum NotificationEventType {
    REACTION_CREATED
    THREAD_REACTION_CREATED
    MESSAGE_CREATED
    THREAD_CREATED
    CHANNEL_CREATED
    DIRECT_MESSAGE_THREAD_CREATED
    USER_JOINED_COMMUNITY
    USER_REQUESTED_TO_JOIN_PRIVATE_CHANNEL
    USER_APPROVED_TO_JOIN_PRIVATE_CHANNEL
    THREAD_LOCKED_BY_OWNER
    THREAD_DELETED_BY_OWNER
    COMMUNITY_INVITE
    MENTION_THREAD
    MENTION_MESSAGE
    PRIVATE_CHANNEL_REQUEST_SENT
    PRIVATE_CHANNEL_REQUEST_APPROVED
    PRIVATE_COMMUNITY_REQUEST_SENT
    PRIVATE_COMMUNITY_REQUEST_APPROVED
  }

  enum EntityType {
    REACTION
    THREAD_REACTION
    MESSAGE
    THREAD
    CHANNEL
    COMMUNITY
    USER
    DIRECT_MESSAGE_THREAD
  }

  type NotificationEntityType {
    id: ID!
    payload: String!
    type: EntityType
  }

  type NotificationsConnection {
    pageInfo: PageInfo
    edges: [NotificationEdge]
  }

  type NotificationEdge {
    cursor: String
    node: Notification
  }

  type Notification {
    id: ID!
    createdAt: Date!
    modifiedAt: Date!
    actors: [NotificationEntityType]!
    context: NotificationEntityType!
    entities: [NotificationEntityType]!
    event: NotificationEventType!
    isRead: Boolean!
    isSeen: Boolean!
  }

  extend type Query {
    notification(id: ID!): Notification
    notifications(first: Int = 10, after: String): NotificationsConnection
      @cost(complexity: 1, multipliers: ["first"])
    directMessageNotifications(
      first: Int = 10
      after: String
    ): NotificationsConnection @cost(complexity: 1, multipliers: ["first"])
  }

  extend type Mutation {
    markAllNotificationsSeen: Boolean
    markDirectMessageNotificationsSeen: Boolean
    markSingleNotificationSeen(id: ID!): Boolean
  }

  extend type Subscription {
    notificationAdded: Notification
    dmNotificationAdded: Notification
  }
`;

module.exports = Notification;
