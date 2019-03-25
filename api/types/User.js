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

  type User @cacheControl(maxAge: 600) {
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
    betaSupporter: Boolean @cacheControl(maxAge: 84700)

    isPro: Boolean @deprecated(reason: "Use the betaSupporter field instead")
    recurringPayments: [RecurringPayment]
      @deprecated(reason: "Payments are no longer used")

    invoices: [Invoice] @deprecated(reason: "Payments are no longer used")

    # non-schema fields
    threadCount: Int @cost(complexity: 1)
    isAdmin: Boolean
    communityConnection: UserCommunitiesConnection!
    channelConnection: UserChannelsConnection!
    directMessageThreadsConnection(
      first: Int = 15
      after: String
    ): UserDirectMessageThreadsConnection!
      @cost(complexity: 1, multipliers: ["first"])
    threadConnection(
      first: Int = 10
      after: String
      kind: ThreadConnectionType
    ): UserThreadsConnection! @cost(complexity: 1, multipliers: ["first"])

    everything(first: Int = 10, after: String): EverythingThreadsConnection!
      @cost(complexity: 1, multipliers: ["first"])

    settings: UserSettings @cost(complexity: 1)
    githubProfile: GithubProfile

    contextPermissions: ContextPermissions
      @deprecated(reason: "Use the CommunityMember type to get permissions")
  }

  extend type Query {
    user(id: ID, username: LowercaseString): User @cacheControl(maxAge: 1200)
    currentUser: User @cacheControl(maxAge: 1200, scope: PRIVATE)
    searchUsers(string: String): [User]
      @deprecated(reason: "Use the new Search query endpoint")
  }

  input EditUserInput {
    file: Upload
    coverFile: Upload
    name: String
    description: String
    website: String
    username: LowercaseString
    timezone: Int
    email: String
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

  input ReportUserInput {
    userId: String!
    reason: String!
  }

  input BanUserInput {
    userId: String!
    reason: String!
  }

  extend type Mutation {
    editUser(input: EditUserInput!): User
    upgradeToPro(input: UpgradeToProInput!): User
    downgradeFromPro: User
    toggleNotificationSettings(input: ToggleNotificationSettingsInput): User
    subscribeWebPush(subscription: WebPushSubscription!): Boolean
    unsubscribeWebPush(endpoint: String!): Boolean
    deleteCurrentUser: Boolean
    updateUserEmail(email: LowercaseString!): User
    reportUser(input: ReportUserInput!): Boolean
    banUser(input: BanUserInput!): Boolean
  }
`;

module.exports = User;
