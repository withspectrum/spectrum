const Meta = /* GraphQL */ `
  type GrowthData {
    count: Int
    weeklyGrowth: Float
    monthlyGrowth: Float
    quarterlyGrowth: Float
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
