const Notification = /* GraphQL */ `
	enum NotificationEventType {
		MESSAGE_CREATED
	  THREAD_CREATED
	  CHANNEL_CREATED
	  DIRECT_MESSAGE_THREAD_CREATED
	  USER_JOINED_COMMUNITY
	  USER_REQUESTED_TO_JOIN_PRIVATE_CHANNEL
	  USER_APPROVED_TO_JOIN_PRIVATE_CHANNEL
	  THREAD_LOCKED_BY_OWNER
	  THREAD_DELETED_BY_OWNER
	}

	enum EntityType {
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

	type Notification {
		id: ID!
		createdAt: Date!
		modifiedAt: Date!
		actors: [ NotificationEntityType ]!
		context: NotificationEntityType!
		entities: [ NotificationEntityType ]!
		event: NotificationEventType!
		isRead: Boolean!
		isSeen: Boolean!
	}

	extend type Query {
		notification(id: ID!): Notification
		notifications(first: Int = 20, after: String): UserNotificationsConnection!
	}

	extend type Mutation {
		markAllUserNotificationsSeen: UserNotificationsConnection!
		markAllUserDirectMessageNotificationsRead: UserNotificationsConnection!
		toggleNotificationReadState(notificationId: ID!): Notification!
	}

	extend type Subscription {
		notificationAdded: Notification
	}
`;

module.exports = Notification;
