const Meta = /* GraphQL */ `
  type GrowthData {
    createdAt: Date
  }

  type SubscriptionGrowthData {
    amount: Int
    createdAt: Date
    plan: String
  }

  type Meta {
    userGrowth: [GrowthData]
    communityGrowth: [GrowthData]
    channelGrowth: [GrowthData]
    threadGrowth: [GrowthData]
    messageGrowth: [GrowthData]
    subscriptionGrowth: [SubscriptionGrowthData]
  }

  extend type Query {
    meta: Meta
  }
`;

module.exports = Meta;
