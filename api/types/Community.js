// @flow
const Community = /* GraphQL */ `
  type CommunityChannelsConnection {
    pageInfo: PageInfo!
    edges: [CommunityChannelEdge!]
  }

  type CommunityChannelEdge {
    node: Channel!
  }

  type CommunityMembersConnection
    @deprecated(reason: "Use the new Community.members type") {
    pageInfo: PageInfo!
    edges: [CommunityMemberEdge!]
  }

  type CommunityMemberEdge
    @deprecated(reason: "Use the new Community.members type") {
    cursor: String!
    node: User!
  }

  type CommunityMembers {
    pageInfo: PageInfo!
    edges: [CommunityMembersEdge!]
  }

  type CommunityMembersEdge {
    cursor: String!
    node: CommunityMember!
  }

  type CommunityThreadsConnection {
    pageInfo: PageInfo!
    edges: [CommunityThreadEdge!]
  }

  type CommunityThreadEdge {
    cursor: String!
    node: Thread!
  }

  type CommunityMetaData @cacheControl(maxAge: 1800) {
    members: Int
    channels: Int
    onlineMembers: Int
  }

  type SlackImport @deprecated(reason: "Use the slack settings field instead") {
    members: String
    teamName: String
    sent: Date
  }

  type TopAndNewThreads {
    topThreads: [Thread]
    newThreads: [Thread]
  }

  type BrandedLogin {
    isEnabled: Boolean
    message: String
  }

  enum CommunityThreadConnectionSort {
    latest
    trending
  }

  type Features {
    analytics: Boolean
    prioritySupport: Boolean
  }

  type StripeCard {
    brand: String
    exp_month: Int
    exp_year: Int
    last4: String
  }

  type StripeSource {
    id: ID
    card: StripeCard
    isDefault: Boolean
  }

  type StripeItem {
    id: ID
    amount: Int
    quantity: Int
    planId: String
    planName: String
  }

  type StripeSubscriptionItem {
    created: Int
    planId: String
    planName: String
    amount: Int
    quantity: Int
    id: String
  }

  type StripeDiscount {
    amount_off: Int
    percent_off: Int
    id: String
  }

  type StripeSubscription {
    id: ID
    created: Int
    discount: StripeDiscount
    billing_cycle_anchor: Int
    current_period_end: Int
    canceledAt: Int
    items: [StripeSubscriptionItem]
    status: String
  }

  type StripeInvoice {
    id: ID
    date: Int
    items: [StripeItem]
    total: Int
  }

  type CommunityBillingSettings {
    pendingAdministratorEmail: LowercaseString
    administratorEmail: LowercaseString
    sources: [StripeSource]
    invoices: [StripeInvoice]
    subscriptions: [StripeSubscription]
  }

  type Community @cacheControl(maxAge: 1200) {
    id: ID!
    createdAt: Date
    name: String!
    slug: LowercaseString!
    description: String
    website: String
    profilePhoto: String
    coverPhoto: String
    reputation: Int
    pinnedThreadId: String
    pinnedThread: Thread
    isPrivate: Boolean
    lastActive: Date
    redirect: Boolean
    noindex: Boolean
    communityPermissions: CommunityPermissions @cost(complexity: 1)

    channelConnection: CommunityChannelsConnection @cost(complexity: 1)
    members(
      first: Int = 10
      after: String
      filter: MembersFilter
    ): CommunityMembers @cost(complexity: 5, multipliers: ["first"])
    threadConnection(
      first: Int = 10
      after: String
      sort: CommunityThreadConnectionSort = latest
    ): CommunityThreadsConnection @cost(complexity: 2, multipliers: ["first"])
    metaData: CommunityMetaData @cost(complexity: 10)
    memberGrowth: GrowthData @cost(complexity: 10)
    conversationGrowth: GrowthData @cost(complexity: 3)

    topMembers: [CommunityMember] @cost(complexity: 10)

    topAndNewThreads: TopAndNewThreads @cost(complexity: 4)

    watercooler: Thread
    brandedLogin: BrandedLogin
    joinSettings: JoinSettings
    slackSettings: CommunitySlackSettings @cost(complexity: 2)

    watercoolerId: String
    slackImport: SlackImport
      @cost(complexity: 2)
      @deprecated(reason: "Use slack settings field instead")

    memberConnection(
      first: Int = 10
      after: String
      filter: MemberConnectionFilter
    ): CommunityMembersConnection!
      @deprecated(reason: "Use the new Community.members type")
    contextPermissions: ContextPermissions
      @deprecated(reason: "Use the new CommunityMember type to get permissions")

    hasFeatures: Features @deprecated(reason: "Payments are no longer used")
    hasChargeableSource: Boolean
      @deprecated(reason: "Payments are no longer used")
    billingSettings: CommunityBillingSettings
      @deprecated(reason: "Payments are no longer used")
    invoices: [Invoice] @deprecated(reason: "Payments are no longer used")
    recurringPayments: [RecurringPayment]
      @deprecated(reason: "Payments are no longer used")
    isPro: Boolean @deprecated(reason: "Payments are no longer used")
  }

  extend type Query {
    community(id: ID, slug: LowercaseString): Community
      @cacheControl(maxAge: 1200)
    communities(
      slugs: [LowercaseString]
      ids: [ID]
      curatedContentType: String
    ): [Community] @cacheControl(maxAge: 1200)
    topCommunities(amount: Int = 20): [Community!]
      @cost(complexity: 4, multipliers: ["amount"])
    recentCommunities: [Community!]

    searchCommunities(string: String, amount: Int = 20): [Community]
      @deprecated(reason: "Use the new Search query endpoint")
    searchCommunityThreads(communityId: ID!, searchString: String): [Thread]
      @deprecated(reason: "Use the new Search query endpoint")
  }

  input MembersFilter {
    isOwner: Boolean
    isMember: Boolean
    isBlocked: Boolean
    isPending: Boolean
    isModerator: Boolean
  }

  input MemberConnectionFilter
    @deprecated(reason: "Use the new MembersFilter input type") {
    isOwner: Boolean
    isMember: Boolean
    isBlocked: Boolean
    isPending: Boolean
    isModerator: Boolean
  }

  input CreateCommunityInput {
    name: String!
    slug: LowercaseString!
    description: String
    website: String
    file: Upload
    coverFile: Upload
    isPrivate: Boolean
  }

  input EditCommunityInput {
    name: String
    description: String
    website: String
    file: Upload
    coverFile: Upload
    coverPhoto: String
    communityId: ID!
  }

  input UpgradeCommunityInput {
    plan: String!
    token: String!
    communityId: String!
  }

  input DowngradeCommunityInput {
    id: String!
  }

  input UpdateAdministratorEmailInput {
    id: ID!
    email: LowercaseString!
  }

  input EnableBrandedLoginInput {
    id: String!
  }

  input DisableBrandedLoginInput {
    id: String!
  }

  input SaveBrandedLoginSettingsInput {
    id: String!
    message: String
  }

  input ImportSlackMembersInput
    @deprecated(
      reason: "Slack imports are no longer used, invites sent directly with sendSlackInvites"
    ) {
    id: String!
  }

  input SendSlackInvitesInput {
    id: ID!
    customMessage: String
  }

  input EnableCommunityTokenJoinInput {
    id: ID!
  }

  input DisableCommunityTokenJoinInput {
    id: ID!
  }

  input ResetCommunityJoinTokenInput {
    id: ID!
  }

  input EnableCommunityWatercoolerInput {
    id: ID!
  }

  input DisableCommunityWatercoolerInput {
    id: ID!
  }

  input SetCommunityLastSeenInput {
    id: ID!
    lastSeen: Date!
  }

  extend type Mutation {
    createCommunity(input: CreateCommunityInput!): Community
      @rateLimit(max: 3, window: "15m")
    editCommunity(input: EditCommunityInput!): Community
    deleteCommunity(communityId: ID!): Boolean
    toggleCommunityMembership(communityId: ID!): Community
      @deprecated(
        reason: "Use the new addCommunityMember or removeCommunityMember mutations"
      )
    sendSlackInvites(input: SendSlackInvitesInput!): Community
    importSlackMembers(input: ImportSlackMembersInput!): Boolean
      @deprecated(reason: "Importing slack members is deprecated")
    sendEmailInvites(input: EmailInvitesInput!): Boolean
      @rateLimit(max: 5000, window: "1w", arrayLengthField: "input.contacts")
    pinThread(threadId: ID!, communityId: ID!, value: String): Community
    upgradeCommunity(input: UpgradeCommunityInput!): Community
      @deprecated(
        reason: "Use feature level upgrade mutations like enableCommunityAnalytics"
      )
    downgradeCommunity(input: DowngradeCommunityInput!): Community
      @deprecated(
        reason: "Use feature level downgrade mutations like disableCommunityAnalytics"
      )
    updateAdministratorEmail(input: UpdateAdministratorEmailInput!): Community
    enableBrandedLogin(input: EnableBrandedLoginInput!): Community
    disableBrandedLogin(input: DisableBrandedLoginInput!): Community
    saveBrandedLoginSettings(input: SaveBrandedLoginSettingsInput!): Community
    enableCommunityTokenJoin(input: EnableCommunityTokenJoinInput!): Community
    disableCommunityTokenJoin(input: DisableCommunityTokenJoinInput!): Community
    resetCommunityJoinToken(input: ResetCommunityJoinTokenInput!): Community
    enableCommunityWatercooler(
      input: EnableCommunityWatercoolerInput!
    ): Community
    disableCommunityWatercooler(
      input: DisableCommunityWatercoolerInput!
    ): Community
    setCommunityLastSeen(input: SetCommunityLastSeenInput!): Community
    toggleCommunityRedirect(communityId: ID!): Community
    toggleCommunityNoindex(communityId: ID!): Community
  }

  extend type Subscription {
    communityUpdated(communityIds: [ID!]): Community
  }
`;

module.exports = Community;
