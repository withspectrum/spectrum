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
  }

  input EditChannelInput {
    name: String
    slug: LowercaseString
    description: String
    isPrivate: Boolean
    channelId: ID!
  }

  type Channel @cacheControl(maxAge: 1200) {
    id: ID!
    createdAt: Date!
    modifiedAt: Date
    name: String!
    description: String!
    slug: LowercaseString!
    isPrivate: Boolean
    isDefault: Boolean
    isArchived: Boolean
    channelPermissions: ChannelPermissions! @cost(complexity: 1)

    communityPermissions: CommunityPermissions!
    community: Community! @cost(complexity: 1) @cacheControl(maxAge: 86400)
    threadConnection(first: Int = 10, after: String): ChannelThreadsConnection!
      @cost(complexity: 1, multipliers: ["first"])
    memberConnection(first: Int = 10, after: String): ChannelMembersConnection!
      @cost(complexity: 1, multipliers: ["first"])
    memberCount: Int!
    metaData: ChannelMetaData @cost(complexity: 1)
    moderators: [User] @cost(complexity: 3)
    owners: [User] @cost(complexity: 3)
    joinSettings: JoinSettings
  }

  extend type Query {
    channel(
      id: ID
      channelSlug: LowercaseString
      communitySlug: LowercaseString
    ): Channel @cost(complexity: 1) @cacheControl(maxAge: 1200)
  }

  extend type Mutation {
    editChannel(input: EditChannelInput!): Channel
    deleteChannel(channelId: ID!): Boolean
  }
`;

module.exports = Channel;
