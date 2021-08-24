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
    pinnedThreadId: String
    pinnedThread: Thread
    isPrivate: Boolean
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
    watercooler: Thread
    joinSettings: JoinSettings

    watercoolerId: String

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

  input EditCommunityInput {
    name: String
    description: String
    website: String
    file: Upload
    coverFile: Upload
    coverPhoto: String
    communityId: ID!
  }

  extend type Mutation {
    editCommunity(input: EditCommunityInput!): Community
    deleteCommunity(communityId: ID!): Boolean
    toggleCommunityRedirect(communityId: ID!): Community
    toggleCommunityNoindex(communityId: ID!): Community
  }
`;

module.exports = Community;
