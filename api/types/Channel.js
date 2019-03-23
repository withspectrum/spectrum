// @flow
const Channel = /* GraphQL */ `
  type ChannelMembersConnection {
    pageInfo: PageInfo!
    edges: [ChannelMemberEdge!]
  }

  type ChannelMemberEdge {
    cursor: String!
    node: User!
  }

  type ChannelThreadsConnection {
    pageInfo: PageInfo!
    edges: [ChannelThreadEdge!]
  }

  type ChannelThreadEdge {
    cursor: String!
    node: Thread!
  }

  type ChannelMetaData {
    threads: Int
      @deprecated(reason: "metaData.threads is deprecated and always returns 0")
    members: Int
    onlineMembers: Int
  }

  input CreateChannelInput {
    name: String!
    slug: LowercaseString!
    description: String
    communityId: ID!
    isPrivate: Boolean
    isDefault: Boolean
  }

  input EditChannelInput {
    name: String
    slug: LowercaseString
    description: String
    isPrivate: Boolean
    channelId: ID!
  }

  enum PendingActionType {
    block
    approve
  }

  input TogglePendingUserInput {
    channelId: ID!
    userId: ID!
    action: PendingActionType!
  }

  input UnblockUserInput {
    channelId: ID!
    userId: ID!
  }

  type Channel @cacheControl(maxAge: 600) {
    id: ID!
    createdAt: Date!
    modifiedAt: Date
    name: String!
    description: String!
    slug: LowercaseString!
    isPrivate: Boolean
    isDefault: Boolean
    isArchived: Boolean
    channelPermissions: ChannelPermissions!
      @cost(complexity: 1)
      @cacheControl(scope: PRIVATE)
    communityPermissions: CommunityPermissions! @cacheControl(scope: PRIVATE)
    community: Community! @cost(complexity: 1) @cacheControl(maxAge: 86400)
    threadConnection(first: Int = 10, after: String): ChannelThreadsConnection!
      @cost(complexity: 1, multipliers: ["first"])
      @cacheControl(maxAge: 300)
    memberConnection(first: Int = 10, after: String): ChannelMembersConnection!
      @cost(complexity: 1, multipliers: ["first"])
      @cacheControl(maxAge: 300)
    memberCount: Int! @cacheControl(maxAge: 300)
    metaData: ChannelMetaData @cost(complexity: 1) @cacheControl(maxAge: 300)
    pendingUsers: [User]
      @cost(complexity: 3)
      @cacheControl(maxAge: 0, scope: PRIVATE)
    blockedUsers: [User]
      @cost(complexity: 3)
      @cacheControl(maxAge: 0, scope: PRIVATE)
    moderators: [User] @cost(complexity: 3)
    owners: [User] @cost(complexity: 3)
    joinSettings: JoinSettings @cacheControl(scope: PRIVATE)
    slackSettings: ChannelSlackSettings @cacheControl(scope: PRIVATE)
  }

  extend type Query {
    channel(
      id: ID
      channelSlug: LowercaseString
      communitySlug: LowercaseString
    ): Channel @cost(complexity: 1)
  }

  input ArchiveChannelInput {
    channelId: ID!
  }

  input RestoreChannelInput {
    channelId: ID!
  }

  input JoinChannelWithTokenInput {
    communitySlug: LowercaseString!
    channelSlug: LowercaseString!
    token: String!
  }

  input EnableChannelTokenJoinInput {
    id: ID!
  }

  input DisableChannelTokenJoinInput {
    id: ID!
  }

  input ResetChannelJoinTokenInput {
    id: ID!
  }

  extend type Mutation {
    createChannel(input: CreateChannelInput!): Channel
      @rateLimit(max: 10, window: "10m")
    editChannel(input: EditChannelInput!): Channel
    deleteChannel(channelId: ID!): Boolean
    toggleChannelSubscription(channelId: ID!): Channel
    joinChannelWithToken(input: JoinChannelWithTokenInput!): Channel
    toggleChannelNotifications(channelId: ID!): Channel
    togglePendingUser(input: TogglePendingUserInput!): Channel
    unblockUser(input: UnblockUserInput!): Channel
    archiveChannel(input: ArchiveChannelInput!): Channel
    restoreChannel(input: RestoreChannelInput!): Channel
    enableChannelTokenJoin(input: EnableChannelTokenJoinInput!): Channel
    disableChannelTokenJoin(input: DisableChannelTokenJoinInput!): Channel
    resetChannelJoinToken(input: ResetChannelJoinTokenInput!): Channel
  }
`;

module.exports = Channel;
