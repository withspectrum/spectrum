const Meta = /* GraphQL */ `
  type GrowthData {
    createdAt: Date
  }

  type Meta {
    userGrowth: [GrowthData]
    communityGrowth: [GrowthData]
    channelGrowth: [GrowthData]
    threadGrowth: [GrowthData]
    messageGrowth: [GrowthData]
  }

  extend type Query {
    meta: Meta
  }
`;

module.exports = Meta;
