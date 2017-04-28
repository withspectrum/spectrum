const Notification = /* GraphQL */ `
	enum NotificationType {
		NEW_MESSAGE
		NEW_STORY
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
		story: Story
		frequency: Frequency
		community: Community
		sender: User!
		content: NotificationContent
		read: Boolean
	}

	extend type Query {
		notification(id: ID!): Notification
	}

	extend type Mutation {
		markNotificationsRead(storyId: ID!): Boolean
	}
`;

module.exports = Notification;
