const Meta = /* GraphQL */ `
  type GrowthDataCounts {
    growth: Float
    currentPeriodCount: Int
    prevPeriodCount: Int
  }
  
  type GrowthData {
    count: Int
    weeklyGrowth: GrowthDataCounts
    monthlyGrowth: GrowthDataCounts
    quarterlyGrowth: GrowthDataCounts
  }

  type Meta {
    usersGrowth: GrowthData
    communitiesGrowth: GrowthData
    channelsGrowth: GrowthData
    threadsGrowth: GrowthData
    directMessageThreadsGrowth: GrowthData
    threadMessagesGrowth: GrowthData
    directMessagesGrowth: GrowthData
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
