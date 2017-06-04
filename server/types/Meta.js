const Meta = /* GraphQL */ `
  type Meta {
    userCount: Int
    communityCount: Int
    channelCount: Int
    threadCount: Int
  }

  extend type Query {
    meta: Meta
  }
`;

module.exports = Meta;
