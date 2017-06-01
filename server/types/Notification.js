const Notification = /* GraphQL */ `
	enum NotificationType {
		NEW_MESSAGE
		NEW_THREAD
		NEW_MENTION
		REACTION
	}

	type NotificationContent {
		title: String!
		excerpt: String
	}

	type Notification {
		id: ID!
		isMine: Boolean
		createdAt: Date!
		type: NotificationType!
		message: Message
		thread: Thread
		channel: Channel
		community: Community
		sender: User!
		content: NotificationContent
		read: Boolean
	}

	extend type Query {
		notification(id: ID!): Notification
		notifications(first: Int = 10, after: String): UserNotificationsConnection!
	}

	extend type Mutation {
		markNotificationsRead(threadId: ID!): Boolean
	}

	extend type Subscription {
		notificationAdded: Notification
	}
`;

module.exports = Notification;
