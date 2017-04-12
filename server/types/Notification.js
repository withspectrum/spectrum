const Notification = /* GraphQL */ `
	enum NotificationType {
		NEW_MESSAGE
		NEW_STORY
		REACTION
	}

	type Notification {
		id: ID!
		user: User!
		createdAt: Date!
		type: NotificationType!
		message: Message
		story: Story
		frequency: Frequency
		community: Community
		sender: User!
		content: String
		read: Boolean
	}

	extend type Query {
		notification(id: ID!): Notification
		notifications(uid: ID!): [Notification!]
	}

	extend type Mutation {
		markNotificationsRead(storyId: ID!): Boolean
	}
`;

module.exports = Notification;
