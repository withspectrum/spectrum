// @flow
const User = /* GraphQL */ `
	type UserCommunitiesConnection {
		pageInfo: PageInfo!
		edges: [UserCommunityEdge!]
	}

	type UserCommunityEdge {
		node: Community!
	}

	type UserChannelsConnection {
		pageInfo: PageInfo!
		edges: [UserChannelEdge!]
	}

	type UserChannelEdge {
		node: Channel!
	}

	type UserDirectMessageThreadsConnection {
		pageInfo: PageInfo!
		edges: [DirectMessageThreadEdge]
	}

	type DirectMessageThreadEdge {
		cursor: String!
		node: DirectMessageThread!
	}

	type UserThreadsConnection {
		pageInfo: PageInfo!
		edges: [UserThreadEdge!]
	}

	type UserThreadEdge {
		cursor: String!
		node: Thread!
	}

	type EverythingThreadsConnection {
		pageInfo: PageInfo!
		edges: [EverythingThreadEdge!]
	}

	type EverythingThreadEdge {
		cursor: String!
		node: Thread!
	}

	type NotificationKindSettings {
		email: Boolean
	}

	type NotificationSettingsType {
		newMessageInThreads: NotificationKindSettings
		newDirectMessage: NotificationKindSettings
		newThreadCreated: NotificationKindSettings
		weeklyDigest: NotificationKindSettings
		dailyDigest: NotificationKindSettings
		newMention: NotificationKindSettings
	}

	type UserNotificationsSettings {
		types: NotificationSettingsType
	}

	type UserSettings {
		notifications: UserNotificationsSettings
	}

	enum ThreadConnectionType {
		participant
		creator
	}

	type GithubProfile {
		id: Int
		username: String
	}

	type User {
		id: ID!
		name: String
		firstName: String
		description: String
		website: String
		username: LowercaseString
		profilePhoto: String
		coverPhoto: String
		email: LowercaseString
		providerId: String
		createdAt: Date!
		lastSeen: Date!
		isOnline: Boolean
		timezone: Int
		totalReputation: Int
		pendingEmail: LowercaseString

		# non-schema fields
    threadCount: Int @cost(complexity: 1)
		isAdmin: Boolean
    isPro: Boolean! @cost(complexity: 1)
		communityConnection: UserCommunitiesConnection!
		channelConnection: UserChannelsConnection!
		directMessageThreadsConnection(first: Int = 15, after: String): UserDirectMessageThreadsConnection! @cost(complexity: 1, multiplier: "first")
		threadConnection(first: Int = 20, after: String, kind: ThreadConnectionType): UserThreadsConnection! @cost(complexity: 1, multiplier: "first")
    everything(first: Int = 20, after: String): EverythingThreadsConnection! @cost(complexity: 1, multiplier: "first")
		recurringPayments: [RecurringPayment]
		invoices: [Invoice]
    settings: UserSettings @cost(complexity: 1)
		githubProfile: GithubProfile

		contextPermissions: ContextPermissions @deprecated(reason:"Use the CommunityMember type to get permissions")
	}

	extend type Query {
		user(id: ID, username: LowercaseString): User
		currentUser: User
		searchUsers(string: String): [User] @deprecated(reason:"Use the new Search query endpoint")
	}

	input EditUserInput {
		file: Upload
		coverFile: Upload
		name: String
		description: String
		website: String
		username: LowercaseString
		timezone: Int
	}

	input UpgradeToProInput {
		plan: String!
		token: String!
	}

	input ToggleNotificationSettingsInput {
		deliveryMethod: String!
		notificationType: String!
	}

	input WebPushSubscriptionKeys {
		p256dh: String!
		auth: String!
	}

	input WebPushSubscription {
		endpoint: String!
		keys: WebPushSubscriptionKeys!
	}

	extend type Mutation {
		editUser(input: EditUserInput!): User
		upgradeToPro(input: UpgradeToProInput!): User
		downgradeFromPro: User
		toggleNotificationSettings(input: ToggleNotificationSettingsInput): User
		subscribeWebPush(subscription: WebPushSubscription!): Boolean
		unsubscribeWebPush(endpoint: String!): Boolean
    subscribeExpoPush(token: String!): Boolean
		deleteCurrentUser: Boolean
		updateUserEmail(email: LowercaseString!): User
	}
`;

module.exports = User;
