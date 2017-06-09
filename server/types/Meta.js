const Meta = /* GraphQL */ `
  type GrowthData {
    createdAt: Date
  }

  type Meta {
    userCount: Int
    communityCount: Int
    channelCount: Int
    threadCount: Int
    messageCount: Int
    userGrowth: [GrowthData]
  }

  extend type Query {
    meta: Meta
  }
`;

module.exports = Meta;
