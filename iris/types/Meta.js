// @flow
const Meta = /* GraphQL */ `
  type UsersGrowthData {
    count: Int
    dau: Int
    wau: Int
    mau: Int
    weeklyGrowth: GrowthDataCounts
    monthlyGrowth: GrowthDataCounts
    quarterlyGrowth: GrowthDataCounts
  }

  type CoreMetrics {
    dau: Int
    wau: Int
    mau: Int
    dac: Int
    wac: Int
    mac: Int
    cpu: Float
    mpu: Float
    tpu: Float
    users: Int
    communities: Int
    threads: Int
    dmThreads: Int
    threadMessages: Int
    dmMessages: Int
    date: Date
  }

  type Meta {
    isAdmin: Boolean
    usersGrowth: UsersGrowthData
    communitiesGrowth: GrowthData
    channelsGrowth: GrowthData
    threadsGrowth: GrowthData
    directMessageThreadsGrowth: GrowthData
    threadMessagesGrowth: GrowthData
    directMessagesGrowth: GrowthData
    coreMetrics: [CoreMetrics]
    topThreads: [Thread]
  }

  extend type Query {
    meta: Meta
  }

  input SaveUserCommunityPermissionsInput {
    isOwner: Boolean
    isMember: Boolean
    isBlocked: Boolean
    isModerator: Boolean
    receiveNotifications: Boolean
    id: ID!
  }

  extend type Mutation {
    saveUserCommunityPermissions(input: SaveUserCommunityPermissionsInput!): User
  }
`;

module.exports = Meta;
